/* POST /api/agent-run   { key, message }
   The site helper. Streams progress as SSE-style lines:
     data: {"stage":"..."}     what it is doing now
     data: {"think":"..."}     the model's plan, streamed as it thinks
     data: {"done":true, summary, pr, prUrl, previewUrl}
     data: {"error":"..."}
   A cheap model decides which pages matter; the big model only drafts.
   The draft goes to a branch + pull request, never straight to main. */
const { keyOk, notConfigured, send } = require("./_shared.js");

const EDITABLE = ["index.html", "whats-on.html", "baby-prints.html", "around-the-kiln.html", "find-us.html"];
const REPO = process.env.GITHUB_REPO || "0xW1LL/joskiln-site";
const GH = "https://api.github.com/repos/" + REPO;
const MODEL_BIG = process.env.AGENT_MODEL || "claude-sonnet-4-5";
const MODEL_SMALL = process.env.AGENT_MODEL_SMALL || "claude-haiku-4-5";
const PREVIEW_SUFFIX = process.env.VERCEL_PREVIEW_SUFFIX || "0x-w1-ll";

function gh(path, opts) {
  opts = opts || {};
  opts.headers = Object.assign({
    "Authorization": "Bearer " + process.env.GITHUB_TOKEN,
    "Accept": "application/vnd.github+json",
    "User-Agent": "joskiln-agent",
    "Content-Type": "application/json"
  }, opts.headers || {});
  return fetch(GH + path, opts).then(async (r) => {
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error("GitHub " + r.status + ": " + (j.message || path));
    return j;
  });
}

function anthropic(body) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  if (notConfigured()) return send(res, 503, { error: "The studio password has not been set up yet." });
  const body = req.body || {};
  if (!keyOk(body.key)) return send(res, 401, { error: "That password is not right." });
  if (!process.env.ANTHROPIC_API_KEY || !process.env.GITHUB_TOKEN)
    return send(res, 503, { error: "The helper is not switched on yet. Will needs to add its two keys." });
  const message = String(body.message || "").slice(0, 1000);
  if (!message.trim()) return send(res, 400, { error: "Say what you would like changed." });

  let closed = false;
  req.on("close", () => { closed = true; });
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store", "Connection": "keep-alive"
  });
  const emit = (obj) => { if (!closed) res.write("data:" + JSON.stringify(obj) + "\n\n"); };

  try {
    /* ---- 1. cheap model picks the pages (saves big-model tokens) ---- */
    emit({ stage: "Working out which pages this touches…" });
    const rules = await fetch("https://raw.githubusercontent.com/" + REPO + "/main/AGENT-RULES.md").then(r => r.text());
    const smallResp = await anthropic({
      model: MODEL_SMALL, max_tokens: 300,
      system: "You route website change requests. Pages: " + EDITABLE.join(", ") +
        ". index.html is the homepage; whats-on.html classes and booking; baby-prints.html baby prints and belly bowls; around-the-kiln.html community and membership; find-us.html contact and directions. " +
        "Requests about gallery PHOTOS are out of scope (Jo's photo editor handles those). " +
        'Reply ONLY with JSON: {"feasible":true|false,"reason":"...","files":["..."]} (1-2 files).',
      messages: [{ role: "user", content: message }]
    });
    const smallJson = await smallResp.json();
    if (!smallResp.ok) throw new Error("The helper could not start (" + ((smallJson.error || {}).message || "API error") + ").");
    let route;
    try { route = JSON.parse(smallJson.content[0].text.match(/\{[\s\S]*\}/)[0]); }
    catch (e) { route = { feasible: true, files: ["index.html"] }; }
    if (!route.feasible) {
      emit({ error: route.reason || "That one is better done in the photo editor or by asking Will." });
      emit({ done: false }); return res.end();
    }
    const files = (route.files || []).filter(f => EDITABLE.includes(f)).slice(0, 2);
    if (!files.length) files.push("index.html");

    /* ---- 2. fetch the current pages ---- */
    emit({ stage: "Reading " + files.join(" and ") + "…" });
    const contents = {};
    for (const f of files) {
      contents[f] = await fetch("https://raw.githubusercontent.com/" + REPO + "/main/" + f).then(r => r.text());
    }
    if (closed) return res.end();

    /* ---- 3. big model drafts, plan streamed as thinking ---- */
    emit({ stage: "Drafting the change…" });
    const bigResp = await anthropic({
      model: MODEL_BIG, max_tokens: 32000, stream: true,
      system: rules + "\n\nFirst write PLAN: followed by a short plain-English plan (2-4 sentences). " +
        'Then on a new line write ===FILES=== followed by ONLY this JSON: {"summary":"one plain sentence for Jo describing the change","files":[{"path":"...","content":"FULL new file"}]}. ' +
        "Only include files you actually changed.",
      messages: [{ role: "user", content: "Jo asks: " + message + "\n\n" +
        files.map(f => "FILE " + f + ":\n" + contents[f]).join("\n\n") }]
    });
    if (!bigResp.ok) { const j = await bigResp.json().catch(() => ({})); throw new Error("Drafting failed (" + ((j.error || {}).message || bigResp.status) + ")."); }
    let full = "", inPlan = true;
    const reader = bigResp.body.getReader(); const dec = new TextDecoder(); let sbuf = "";
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      if (closed) { reader.cancel().catch(() => {}); return res.end(); }
      sbuf += dec.decode(chunk.value, { stream: true });
      const lines = sbuf.split("\n"); sbuf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        let ev; try { ev = JSON.parse(line.slice(5)); } catch (e) { continue; }
        if (ev.type === "content_block_delta" && ev.delta && ev.delta.text) {
          full += ev.delta.text;
          if (inPlan) {
            const cut = full.indexOf("===FILES===");
            if (cut === -1) emit({ think: ev.delta.text });
            else { inPlan = false; emit({ stage: "Writing the new page…" }); }
          }
        }
      }
    }
    const cut = full.indexOf("===FILES===");
    if (cut === -1) throw new Error("The draft came back in the wrong shape. Try asking again.");
    let draft;
    try { draft = JSON.parse(full.slice(cut + 11).trim().match(/\{[\s\S]*\}/)[0]); }
    catch (e) { throw new Error("The draft came back garbled. Try asking again."); }
    if (!draft.files || !draft.files.length) throw new Error("Nothing needed changing, according to the draft.");
    for (const f of draft.files) {
      if (!EDITABLE.includes(f.path)) throw new Error("The draft tried to touch " + f.path + ", which is off limits. Binned it.");
    }
    if (closed) return res.end();

    /* ---- 4. branch + pull request (the preview) ---- */
    emit({ stage: "Building the preview…" });
    const main = await gh("/git/ref/heads/main");
    const branch = "agent-" + Date.now().toString(36);
    await gh("/git/refs", { method: "POST", body: JSON.stringify({ ref: "refs/heads/" + branch, sha: main.object.sha }) });
    for (const f of draft.files) {
      const existing = await gh("/contents/" + f.path + "?ref=" + branch);
      await gh("/contents/" + f.path, {
        method: "PUT",
        body: JSON.stringify({
          message: "Site helper: " + (draft.summary || message).slice(0, 60),
          content: Buffer.from(f.content).toString("base64"),
          sha: existing.sha, branch: branch
        })
      });
    }
    const pr = await gh("/pulls", {
      method: "POST",
      body: JSON.stringify({
        title: "Jo asked: " + message.slice(0, 60),
        head: branch, base: "main",
        body: (draft.summary || "") + "\n\nDrafted by the site helper for Jo to approve.\n\nCo-Authored-By: Claude <noreply@anthropic.com>"
      })
    });
    const previewUrl = "https://joskiln-site-git-" + branch + "-" + PREVIEW_SUFFIX + ".vercel.app";
    emit({ done: true, summary: draft.summary, pr: pr.number, prUrl: pr.html_url, previewUrl: previewUrl });
    res.end();
  } catch (e) {
    emit({ error: e.message || "Something went wrong. Try again in a minute." });
    res.end();
  }
};

module.exports.config = { supportsResponseStreaming: true };
