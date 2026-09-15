/* GET /api/gallery-list
   Returns the gallery manifest, or {empty:true} when none has been
   saved yet. Public and unauthenticated: it only serves what the
   public site displays anyway. */
const { list } = require("@vercel/blob");
const { MANIFEST_PATH, send } = require("./_shared.js");

module.exports = async (req, res) => {
  try {
    const found = await list({ prefix: MANIFEST_PATH, limit: 1 });
    const blob = (found.blobs || [])[0];
    if (!blob) return send(res, 200, { empty: true });
    const r = await fetch(blob.url, { cache: "no-store" });
    if (!r.ok) return send(res, 200, { empty: true });
    const manifest = await r.json();
    return send(res, 200, manifest);
  } catch (e) {
    /* No Blob store yet, bad JSON, or a network blip: the site
       falls back to its baked-in photos, so report empty. */
    return send(res, 200, { empty: true, note: "fallback" });
  }
};
