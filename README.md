# Job Portal App (frontend)

A learning project: a job board built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4** and **Motion**, talking to the Spring Boot backend [job_portal_app_backend](https://github.com/junaaid96/job_portal_app_backend).

📘 **New to these tools? Read the [concept guide](docs/GUIDE.md).** Every source file is also commented line by line.

## Features
- Register and log in (JWT stored in `localStorage`, auto-logout when it expires)
- Dashboard with live stats
- Browse jobs with debounced live search, plus a server-rendered search page (`/jobPosts/search?q=...`)
- Create, edit and delete your own job posts

## Getting started
Requirements: Node.js 20.9+ (22 LTS recommended) and the backend running on `http://localhost:8080`.

```bash
cp .env.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack and hot reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint 9 (flat config, Next.js + React Hooks rules) |
| `npm test` | Vitest + React Testing Library |

## Project structure
```
app/
  layout.jsx            root layout (fonts, global CSS, metadata)
  page.jsx              "/": login/register or dashboard
  jobPosts/page.jsx     "/jobPosts": list + search + add
  jobPosts/[id]/page.jsx job details, edit, delete
  jobPosts/search/page.jsx server-rendered search results
  components/           reusable UI pieces
  hooks/                custom hooks (useAuth, useMounted)
  lib/                  API client, auth store, JWT helpers
tests/                  Vitest tests
docs/GUIDE.md           concepts explained
```
