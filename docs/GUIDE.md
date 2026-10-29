# Concept guide

This guide explains the ideas used in this project, with pointers to where each one appears in the code.

## 1. The stack
| Tool | Role |
| --- | --- |
| **React 19** | UI library: you describe the UI as components and React updates the DOM. |
| **Next.js 16** | React framework: file-based routing, server rendering, bundling (Turbopack), fonts, metadata. |
| **Tailwind CSS 4** | Utility classes such as `p-4` and `text-red-500` instead of hand-written CSS. Configured in CSS (`@import "tailwindcss"` and `@theme`), with no `tailwind.config.js`. |
| **Motion** | Animation library (formerly Framer Motion). |
| **ESLint 9** | Finds bugs and bad patterns. Uses the "flat config" in `eslint.config.mjs`. |
| **Vitest + Testing Library** | Unit and component tests in a fake browser (jsdom). |

## 2. Components and JSX
A component is a function that returns JSX, which is HTML-like syntax compiled to JavaScript (`app/components/Spinner.jsx`).
- **Props** are the component's inputs. They are read-only: `function Dashboard({ username, onLogout })`.
- **Conditional rendering**: `{error && <p>{error}</p>}` or `cond ? <A/> : <B/>`.
- **Lists**: `jobs.map(job => <JobCard key={job.postId} job={job} />)`. The `key` lets React track items between renders.
- **Fragments** (`<>...</>`) group elements without adding a DOM node.

## 3. State and hooks
Hooks are functions starting with `use` that you call at the top level of a component. Never call them inside conditions or loops.
- `useState`: local state. Calling the setter re-renders the component. Use the functional form `setX(prev => ...)` when the new value depends on the old one (`jobPosts/page.jsx`).
- `useEffect`: syncs with something outside React, such as fetching data or timers. Return a **cleanup** function. The `ignore` flag pattern prevents stale responses from overwriting newer ones. The dependency array (`[id]`) controls when it re-runs.
- **Derived state**: if a value can be computed from props/state, compute it during render instead of storing it (`isLoading` in `jobPosts/page.jsx`, the stats in `Dashboard.jsx`).
- `useSyncExternalStore`: the official way to read data that lives outside React, here `localStorage` (`hooks/useAuth.js`, `lib/auth.js`).
- **Custom hooks** (`useAuth`, `useMounted`) bundle hook logic for reuse.

## 4. React 19 Actions and forms
- `<form action={fn}>`: React calls `fn(formData)` on submit. You don't need `preventDefault` or an `onChange` per input.
- `useActionState(action, initialState)` returns `[state, formAction, isPending]`. It is used in `AuthForm.jsx` and `AddJobButton.jsx`.
- `useTransition` with an **async** function marks work as a transition and gives you `isPending` (save and delete in `jobPosts/[id]/page.jsx`).
- **Controlled** inputs (`value` + `onChange`, as in `SearchBar.jsx`) vs **uncontrolled** inputs (`defaultValue` read through FormData, as in the edit form).

## 5. Routing (App Router)
Folders inside `app/` become URLs:
| File | URL |
| --- | --- |
| `app/page.jsx` | `/` |
| `app/jobPosts/page.jsx` | `/jobPosts` |
| `app/jobPosts/[id]/page.jsx` | `/jobPosts/42`, where `[id]` is a **dynamic segment** read with `useParams()` |
| `app/jobPosts/search/page.jsx` | `/jobPosts/search?q=java` |

Special files: `layout.jsx` wraps pages and `loading.jsx` is the Suspense fallback. `<Link>` navigates on the client and `useRouter().push()` navigates from code.

## 6. Server vs Client Components
By default, files in `app/` are **Server Components**. They run on the server, can be `async` and `await` data, and send no JavaScript to the browser (`search/page.jsx`, `layout.jsx`). Add `"use client"` at the top when you need state, effects, event handlers or browser APIs such as `localStorage`. Since Next.js 15, `params` and `searchParams` are **Promises** in server pages, so you `await` them.

Hydration: the server renders HTML and React then attaches to it in the browser. Both outputs must match, which is why `page.jsx` uses `useMounted()` before showing anything that depends on `localStorage`.

## 7. Talking to the API
All HTTP calls live in `app/lib/api.js`:
- `fetch` with JSON bodies. On non-2xx responses we throw an `ApiError` that carries `status`, so the UI can tell a 404 ("not found") from a 401 ("log in again").
- The base URL comes from `NEXT_PUBLIC_API_URL` (see `.env.example`). `NEXT_PUBLIC_` variables are inlined into the browser bundle, so they must never hold secrets.

Backend contract:
| Endpoint | Notes |
| --- | --- |
| `POST /login` | Returns the raw JWT as plain text |
| `POST /register` | `201 Created`. The response never includes the password hash. |
| `GET /jobPosts`, `GET /jobPosts/search/{keyword}` | Public |
| `GET /jobPost/{id}` | `404` if missing |
| `POST` / `PUT /jobPost`, `DELETE /jobPost/{id}` | Need `Authorization: Bearer <jwt>`. The server sets `addedBy` from the token, so the client does not send it. |

## 8. Authentication with JWT
1. Log in, and the server returns a signed **JWT** (`header.payload.signature`, base64url-encoded).
2. We store it (`lib/auth.js`) and send it as `Authorization: Bearer ...` on protected requests.
3. `lib/jwt.js` decodes the payload to read `sub` (the username) and `exp` (the expiry). Decoding is **not** verification: only the server can trust the token. The client uses it for display only, for example to show Edit/Delete to the owner.
4. `useAuth` schedules an automatic logout when the token expires.

> Security note: `localStorage` is readable by any script on the page (an XSS risk). Production apps often use `HttpOnly` cookies instead. We use `localStorage` here because it keeps the learning flow simple.

## 9. Styling with Tailwind 4
Classes are composed in JSX. `globals.css` imports Tailwind and defines theme tokens with `@theme`. PostCSS runs Tailwind through `@tailwindcss/postcss`.

## 10. Tooling and testing
- `next dev` and `next build` use **Turbopack**.
- `eslint.config.mjs` spreads `eslint-config-next/core-web-vitals`, which includes the React Hooks rules that catch missing effect dependencies. Next 16 removed `next lint`, so we call `eslint .` directly.
- Tests live in `tests/`: `vi.spyOn(globalThis, "fetch")` fakes the network, `render` and `screen` from Testing Library mount components, and `fireEvent` simulates user input.

## Exercises
1. Add a "My jobs" filter to `/jobPosts` (hint: compare `job.addedBy` with `useAuth().username`).
2. Show a toast when a job is created.
3. Use `useOptimistic` to show edits before the server responds.
