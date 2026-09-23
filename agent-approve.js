/* POST /api/agent-approve   { key, pr, action: "approve" | "discard" }
   approve = merge the helper's pull request (the change goes live);
   discard = close it and delete its branch (nothing changes). */
const { keyOk, notConfigured, send } = require("./_shared.js");

const REPO = process.env.GITHUB_REPO || "0xW1LL/joskiln-site";
const GH = "https://api.github.com/repos/" + REPO;

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

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  if (notConfigured()) return send(res, 503, { error: "The studio password has not been set up yet." });
  const body = req.body || {};
  if (!keyOk(body.key)) return send(res, 401, { error: "That password is not right." });
  if (!process.env.GITHUB_TOKEN) return send(res, 503, { error: "The helper is not switched on yet." });

  const prNum = Number(body.pr);
  if (!prNum) return send(res, 400, { error: "Which change?" });

  try {
    const pr = await gh("/pulls/" + prNum);
    if (!pr.head || !String(pr.head.ref).startsWith("agent-"))
      return send(res, 400, { error: "That is not one of the helper's changes." });
    if (body.action === "approve") {
      if (pr.state !== "open") return send(res, 400, { error: "That change was already dealt with." });
      await gh("/pulls/" + prNum + "/merge", { method: "PUT", body: JSON.stringify({ merge_method: "squash" }) });
    } else {
      if (pr.state === "open") {
        await gh("/pulls/" + prNum, { method: "PATCH", body: JSON.stringify({ state: "closed" }) });
      }
    }
    await gh("/git/refs/heads/" + pr.head.ref, { method: "DELETE" }).catch(() => {});
    return send(res, 200, { ok: true });
  } catch (e) {
    return send(res, 500, { error: e.message || "That did not work. Try again." });
  }
};
