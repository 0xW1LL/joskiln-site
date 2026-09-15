/* Shared helpers for the gallery API. Not a route (leading underscore). */
const crypto = require("crypto");

const MANIFEST_PATH = "gallery/galleries.json";
const GALLERY_KEYS = ["fresh", "baby", "around"];

/* Constant-time-ish comparison of the studio password. */
function keyOk(sent) {
  const real = process.env.ADMIN_KEY || "";
  if (!real || typeof sent !== "string" || !sent) return false;
  const a = Buffer.from(String(sent));
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* True when the ADMIN_KEY env var has not been set up yet. */
function notConfigured() {
  return !process.env.ADMIN_KEY;
}

/* Loose schema check so a buggy client can't wreck the manifest. */
function validManifest(m) {
  if (!m || typeof m !== "object" || !m.galleries) return "no galleries object";
  for (const k of Object.keys(m.galleries)) {
    if (!GALLERY_KEYS.includes(k)) return "unknown gallery: " + k;
    const tiles = m.galleries[k].tiles;
    if (!Array.isArray(tiles)) return k + " has no tiles array";
    if (tiles.length > 60) return k + " has too many tiles";
    for (const t of tiles) {
      if (!t || typeof t !== "object") return "bad tile in " + k;
      const type = t.type || "image";
      if (!["image", "pair", "video"].includes(type)) return "bad tile type in " + k;
      if (typeof t.src !== "string" || !t.src) return "tile without src in " + k;
      if (type === "pair" && (typeof t.src2 !== "string" || !t.src2)) return "pair without src2 in " + k;
      if ((t.caption || "").length > 140) return "caption too long in " + k;
    }
  }
  return null;
}

function send(res, status, obj) {
  res.status(status).setHeader("Cache-Control", "no-store");
  res.json(obj);
}

module.exports = { MANIFEST_PATH, GALLERY_KEYS, keyOk, notConfigured, validManifest, send };
