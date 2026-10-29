// One place for every HTTP call to the Spring Boot backend.
// Components import these functions instead of calling fetch() directly,
// so URLs, headers and error handling live in a single module.
import { getToken } from "@/app/lib/auth";

// NEXT_PUBLIC_* env vars are inlined at build time; fall back to the local backend.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** Error type that remembers the HTTP status, so callers can react to 401/404 etc. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message); // sets this.message
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Small wrapper around fetch().
 * @param {string} path      e.g. "/jobPosts"
 * @param {object} options   method, body (plain object), auth (attach JWT?), parse ("json" | "text" | "none")
 */
async function request(path, { method = "GET", body, auth = false, parse = "json" } = {}) {
  const headers = {}; // built up conditionally below
  if (body !== undefined) headers["Content-Type"] = "application/json"; // we send JSON
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`; // standard JWT bearer header
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body), // object -> JSON string
    cache: "no-store", // always ask the server; job data changes often
  });

  if (!res.ok) {
    // Non-2xx: read the body as text (may be empty) and throw a typed error.
    const text = await res.text().catch(() => "");
    throw new ApiError(text || `Request failed with status ${res.status}`, res.status);
  }
  if (parse === "none" || res.status === 204) return null; // nothing to read
  if (parse === "text") return res.text();
  const text = await res.text(); // tolerate empty bodies before parsing JSON
  return text ? JSON.parse(text) : null;
}

// ---- Auth endpoints ----

/** POST /login -> the backend returns the raw JWT string as plain text. */
export function login(credentials) {
  return request("/login", { method: "POST", body: credentials, parse: "text" });
}

/** POST /register -> 201 Created with the user (no password hash). */
export function register(credentials) {
  return request("/register", { method: "POST", body: credentials });
}

// ---- Job post endpoints ----

export const getJobs = () => request("/jobPosts"); // GET all jobs (public)

export const getJob = (id) => request(`/jobPost/${encodeURIComponent(id)}`); // 404 -> ApiError(status 404)

export const searchJobs = (keyword) =>
  request(`/jobPosts/search/${encodeURIComponent(keyword)}`); // encode spaces, slashes, etc.

/**
 * Create a job. The server takes `addedBy` from the JWT, so we do not send it.
 * Returns the saved job when the server echoes it back.
 */
export const createJob = (job) => request("/jobPost", { method: "POST", body: job, auth: true });

/** Update a job (only its owner may do this; the server checks the JWT). */
export const updateJob = (job) => request("/jobPost", { method: "PUT", body: job, auth: true });

/** Delete a job by id. */
export const deleteJob = (id) =>
  request(`/jobPost/${encodeURIComponent(id)}`, { method: "DELETE", auth: true, parse: "none" });
