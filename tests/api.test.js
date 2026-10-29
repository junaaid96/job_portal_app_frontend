import { afterEach, describe, expect, it, vi } from "vitest";
import { createJob, getJob, login, register } from "@/app/lib/api";
import { saveToken } from "@/app/lib/auth";

// Replace the global fetch with a fake that returns the given status/body.
const mockFetch = (status, body = "") =>
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(body, { status }));

afterEach(() => vi.restoreAllMocks());

describe("api client", () => {
  it("login returns the raw JWT text", async () => {
    mockFetch(200, "abc.def.ghi");
    await expect(login({ username: "u", password: "p" })).resolves.toBe("abc.def.ghi");
  });

  it("register accepts 201 Created", async () => {
    mockFetch(201, JSON.stringify({ username: "u" }));
    await expect(register({ username: "u", password: "p" })).resolves.toEqual({ username: "u" });
  });

  it("getJob throws an ApiError with status 404 for a missing job", async () => {
    mockFetch(404, "");
    await expect(getJob(99)).rejects.toMatchObject({ status: 404 });
  });

  it("createJob sends the bearer token and no addedBy", async () => {
    saveToken("t.o.k");
    const spy = mockFetch(200, "");
    await createJob({ postProfile: "Dev" });
    const [, init] = spy.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer t.o.k");
    expect(JSON.parse(init.body)).not.toHaveProperty("addedBy");
  });
});
