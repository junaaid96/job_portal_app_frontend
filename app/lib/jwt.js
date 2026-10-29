// Helpers for reading a JSON Web Token (JWT) in the browser.
// A JWT is three base64url parts: header.payload.signature. We only read the payload;
// the SERVER verifies the signature, the client must never trust it for security.

/** Decode the payload of a JWT, or return null if it is malformed. */
export function decodeJwt(token) {
  if (typeof token !== "string") return null; // guard against null/undefined
  const parts = token.split("."); // ["header", "payload", "signature"]
  if (parts.length !== 3) return null; // not a JWT
  try {
    // base64url uses - and _ instead of + and /, and may omit "=" padding
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0)); // binary string -> bytes
    return JSON.parse(new TextDecoder().decode(bytes)); // bytes -> UTF-8 text -> object
  } catch {
    return null; // any decoding error means an unusable token
  }
}

/** The username stored in the standard "sub" (subject) claim. */
export function getUsername(token) {
  return decodeJwt(token)?.sub ?? null; // ?. and ?? avoid crashes on bad tokens
}

/** Expiry time in milliseconds since epoch ("exp" claim is in seconds), or null. */
export function getExpiry(token) {
  const exp = decodeJwt(token)?.exp;
  return typeof exp === "number" ? exp * 1000 : null;
}
