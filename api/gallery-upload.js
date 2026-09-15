/* POST /api/gallery-upload   { key, filename, contentType, data }
   `data` is a base64 string (no data: prefix) of an image already
   resized on the phone. Saves it to Blob storage and returns {url}.
   Requires the studio password (ADMIN_KEY). */
const { put } = require("@vercel/blob");
const { keyOk, notConfigured, send } = require("./_shared.js");

const MAX_BYTES = 3.5 * 1024 * 1024; // fits Vercel's 4.5MB request cap with headroom
const TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "POST only" });
  if (notConfigured()) return send(res, 503, { error: "The studio password has not been set up yet." });
  const body = req.body || {};
  if (!keyOk(body.key)) return send(res, 401, { error: "That password is not right." });

  const ext = TYPES[body.contentType];
  if (!ext) return send(res, 400, { error: "Photos only here (jpg, png or webp)." });
  if (typeof body.data !== "string" || !body.data) return send(res, 400, { error: "No photo data received." });

  let buf;
  try { buf = Buffer.from(body.data, "base64"); } catch { return send(res, 400, { error: "Photo data was garbled." }); }
  if (!buf.length || buf.length > MAX_BYTES) return send(res, 400, { error: "Photo too large after resizing." });

  const safeName = String(body.filename || "photo").toLowerCase()
    .replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "photo";

  try {
    const blob = await put("gallery/img/" + safeName + ext, buf, {
      access: "public",
      addRandomSuffix: true,      // never collide, never overwrite a photo in use
      contentType: body.contentType,
      cacheControlMaxAge: 31536000
    });
    return send(res, 200, { url: blob.url });
  } catch (e) {
    return send(res, 500, { error: "Could not save the photo. Try again in a minute." });
  }
};
