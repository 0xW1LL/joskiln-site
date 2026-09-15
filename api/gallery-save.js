/* POST /api/gallery-save   { key, ping? , manifest? }
   With ping:true it just checks the password (used by the admin
   page's front door). Otherwise it validates and stores the whole
   manifest as gallery/galleries.json. Requires ADMIN_KEY. */
const { put } = require("@vercel/blob");
const { MANIFEST_PATH, keyOk, notConfigured, validManifest, send } = require("./_shared.js");

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  if (notConfigured()) return send(res, 503, { error: "The studio password has not been set up yet." });
  const body = req.body || {};
  if (!keyOk(body.key)) return send(res, 401, { error: "That password is not right." });

  if (body.ping) return send(res, 200, { ok: true });

  const manifest = body.manifest;
  const problem = validManifest(manifest);
  if (problem) return send(res, 400, { error: "That change did not look right (" + problem + ")." });

  const doc = {
    version: 1,
    updated: new Date().toISOString(),
    galleries: manifest.galleries
  };
  const json = JSON.stringify(doc);
  if (json.length > 200 * 1024) return send(res, 400, { error: "The gallery list has grown too large." });

  try {
    await put(MANIFEST_PATH, json, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 0
    });
    return send(res, 200, { ok: true, updated: doc.updated });
  } catch (e) {
    return send(res, 500, { error: "Could not save. Try again in a minute." });
  }
};
