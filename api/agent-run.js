/* POST /api/agent-run   { key, message }
   The site helper. Streams progress as SSE-style lines:
     data: {"stage":"..."}     what it is doing now
     data: {"think":"..."}     the model's plan, streamed as it thinks
     data: {"done":true, summary, pr, prUrl, previewUrl}
     data: {"error":"..."}
   A cheap model decides which pages matter; the big model only drafts.
   The draft goes to a branch + pull request, never straight to main. */
const { keyOk, notConfigured, send } = require("./_shared.js");
const { list } = require("@vercel/blob");

const DIARY_PATH = "agent/diary.txt";
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

async function readDiary() {
  try {
    const found = await list({ prefix: DIARY_PATH, limit: 1 });
    const blob = (found.blobs || [])[0];
    if (!blob) return "";
    const r = await fetch(blob.url + "?t=" + Date.now(), { cache: "no-store" });
    return r.ok ? await r.text() : "";
  } catch (e) { return ""; }
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
    const diary = await readDiary();
    const smallResp = await anthropic({
      model: MODEL_SMALL, max_tokens: 300,
      system: "You route website change requests. Pages: " + EDITABLE.join(", ") +
        ". index.html is the homepage; whats-on.html classes and booking; baby-prints.html baby prints and belly bowls; around-the-kiln.html community and membership; find-us.html contact and directions. " +
        "NEVER ask for clarification and never refuse for vagueness: if the request is vague, pick the most likely 1-2 pages and let the drafter (which reads the full pages) work it out. " +
        "feasible:false ONLY when the request is about gallery photos (Jo's photo editor handles those) or is clearly not a website text change at all. " +
        "The reason is shown to Jo, who is not technical: one short warm sentence, no file names, no jargon. " +
        'Reply ONLY with JSON: {"feasible":true|false,"reason":"...","files":["..."]} (1-2 files).',
      messages: [{ role: "user", content: message }]
    });
    const smallJson = await smallResp.json();
    if (!smallResp.ok) throw new Error("The helper could not start (" + ((smallJson.error || {}).message || "API error") + ").");
    let route;
    try { route = JSON.parse(smallJson.content[0].text.match(/\{[\s\S]*\}/)[0]); }
    catch (e) { route = { feasible: true, files: ["index.html"] }; }
    /* the router must never quiz Jo: a "please clarify" style refusal, or one
       that leaks file names, gets overridden and the drafter works it out */
    if (!route.feasible && /\.html|clarif|specif/i.test(route.reason || ""))
      route = { feasible: true, files: route.files || [] };
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
      model: MODEL_BIG, max_tokens: 8000, stream: true,
      system: rules +
        (diary ? "\n\n## Diary of Jo's past requests\nAPPROVED means Jo put it live. BINNED means she rejected it, do not repeat what she binned. When she says something like 'like before', check here.\n" + diary : "") +
        "\n\nFirst write PLAN: followed by a short plain-English plan (2-4 sentences). " +
        "Then output edits in EXACTLY this format, no code fences:\n" +
        "===SUMMARY===\none plain sentence for Jo describing the change\n" +
        "===EDIT the-file-name.html===\n" +
        "<<<OLD\nan exact character-for-character copy of the part of the current file to change. Include enough surrounding lines that this text appears only once in the file.\n" +
        "<<<NEW\nwhat that part should become. Leave this empty to remove it.\n" +
        "(repeat ===EDIT ...=== blocks as needed, several per file is fine)\n" +
        "===END===\n" +
        "Never retype the whole file. Keep each OLD chunk as small as uniqueness allows.",
      messages: [{ role: "user", content: "Jo asks: " + message + "\n\n" +
        files.map(f => "FILE " + f + ":\n" + contents[f]).join("\n\n") }]
    });
    if (!bigResp.ok) { const j = await bigResp.json().catch(() => ({})); throw new Error("Drafting failed (" + ((j.error || {}).message || bigResp.status) + ")."); }
    let full = "", inPlan = true, stopReason = "";
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
            const cut = full.indexOf("===SUMMARY===");
            if (cut === -1) emit({ think: ev.delta.text });
            else { inPlan = false; emit({ stage: "Writing the new page…" }); }
          }
        }
        if (ev.type === "message_delta" && ev.delta && ev.delta.stop_reason) stopReason = ev.delta.stop_reason;
      }
    }
    if (stopReason === "max_tokens" || (full.indexOf("===EDIT ") !== -1 && full.indexOf("===END===") === -1))
      throw new Error("That change was too big to draft in one go. Try asking for less at a time.");
    const cut = full.indexOf("===SUMMARY===");
    if (cut === -1) throw new Error("The draft came back in the wrong shape. Try asking again.");
    let tail = full.slice(cut + "===SUMMARY===".length);
    const endIdx = tail.indexOf("===END===");
    if (endIdx !== -1) tail = tail.slice(0, endIdx);
    const parts = tail.split(/===EDIT ([^=\n]+)===/);
    const summary = parts[0].trim();
    const edits = [];
    for (let i = 1; i < parts.length; i += 2) {
      const path = parts[i].trim();
      const block = String(parts[i + 1] || "");
      const o = block.indexOf("<<<OLD"); const n = block.indexOf("<<<NEW");
      if (o === -1 || n === -1 || n < o) throw new Error("The draft came back garbled. Try asking again.");
      const oldTxt = block.slice(o + 6, n).replace(/^\n/, "").replace(/\n$/, "");
      const newTxt = block.slice(n + 6).replace(/^\n/, "").replace(/\n+\s*$/, "");
      if (!oldTxt) throw new Error("The draft came back garbled. Try asking again.");
      edits.push({ path: path, oldTxt: oldTxt, newTxt: newTxt });
    }
    if (!edits.length) throw new Error("Nothing needed changing, according to the draft.");

    /* apply the edits to the master copies fetched above */
    const changed = {};
    for (const e of edits) {
      if (!EDITABLE.includes(e.path)) throw new Error("The draft tried to touch " + e.path + ", which is off limits. Binned it.");
      if (!(e.path in contents))
        contents[e.path] = await fetch("https://raw.githubusercontent.com/" + REPO + "/main/" + e.path).then(r => r.text());
      const cur = changed[e.path] != null ? changed[e.path] : contents[e.path];
      const hits = cur.split(e.oldTxt).length - 1;
      if (hits === 0) throw new Error("The helper misquoted " + e.path + " and the edit could not be placed. Nothing changed, try asking again.");
      if (hits > 1) throw new Error("The helper's edit to " + e.path + " was ambiguous. Nothing changed, try asking again.");
      const at = cur.indexOf(e.oldTxt);
      changed[e.path] = cur.slice(0, at) + e.newTxt + cur.slice(at + e.oldTxt.length);
    }
    const draft = { summary: summary, files: Object.keys(changed).map(p => ({ path: p, content: changed[p] })) };
    for (const f of draft.files) {
      if (f.content.indexOf("</html>") === -1) throw new Error("The draft of " + f.path + " came back incomplete. Binned it, try asking again.");
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
