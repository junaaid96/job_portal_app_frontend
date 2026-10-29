import { describe, expect, it } from "vitest";
import { decodeJwt, getExpiry, getUsername } from "@/app/lib/jwt";

// Build an unsigned test token: base64url(header).base64url(payload).signature
const b64url = (obj) => btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const makeToken = (payload) => `${b64url({ alg: "HS256" })}.${b64url(payload)}.sig`;

describe("jwt helpers", () => {
  it("decodes the payload and reads sub/exp", () => {
    const token = makeToken({ sub: "alice", exp: 2_000_000_000 });
    expect(decodeJwt(token)).toEqual({ sub: "alice", exp: 2_000_000_000 });
    expect(getUsername(token)).toBe("alice");
    expect(getExpiry(token)).toBe(2_000_000_000_000);
  });

  it("returns null for malformed tokens", () => {
    expect(decodeJwt("not-a-token")).toBeNull();
    expect(decodeJwt(null)).toBeNull();
    expect(getUsername("a.b.c")).toBeNull();
  });
});
