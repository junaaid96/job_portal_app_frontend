"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs } from "@/app/lib/api";

/**
 * Dashboard shown after login. Props are read-only inputs passed by the parent.
 * @param {{ username: string, onLogout: () => void }} props
 */
export default function Dashboard({ username, onLogout }) {
  const [jobs, setJobs] = useState([]); // all job posts from the API
  const [error, setError] = useState(null);

  // Fetch once after the first render. The `ignore` flag prevents setting state
  // if the component unmounted before the request finished (a classic race condition).
  useEffect(() => {
    let ignore = false;
    getJobs()
      .then((data) => !ignore && setJobs(Array.isArray(data) ? data : []))
      .catch(() => !ignore && setError("Could not load jobs. Is the backend running?"));
    return () => {
      ignore = true; // cleanup
    };
  }, []); // [] = run only on mount

  // Derived values: computed during render, not stored in state.
  const myJobs = jobs.filter((job) => job.addedBy === username).length;
  const techCount = new Set(jobs.flatMap((job) => job.postTechStack ?? [])).size;

  const stats = [
    { label: "Total Job Posts", value: jobs.length },
    { label: "Posted by You", value: myJobs },
    { label: "Technologies", value: techCount },
  ];

  return (
    <div className="w-full max-w-5xl">
      <nav className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Hello, {username}</span>
          <button onClick={onLogout} className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* .map() turns data into JSX; every item needs a stable, unique `key` */}
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-2 text-gray-600">{stat.label}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* <Link> does client-side navigation (no full page reload) and prefetches the route */}
      <Link href="/jobPosts" className="block rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
        <h3 className="mb-2 text-xl font-semibold">Find Jobs</h3>
        <p className="text-gray-600">Browse, search, post and manage job openings</p>
      </Link>
    </div>
  );
}
