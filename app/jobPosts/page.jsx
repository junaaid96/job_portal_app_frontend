"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs, searchJobs } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import SearchBar from "@/app/components/SearchBar";
import AddJobButton from "@/app/components/AddJobButton";
import JobCard from "@/app/components/JobCard";
import Spinner from "@/app/components/Spinner";

/** "/jobPosts": list every job, with live search and an "Add" button for logged-in users. */
export default function JobPosts() {
  const { isLoggedIn } = useAuth();
  const [keyword, setKeyword] = useState(""); // what the user typed
  const [result, setResult] = useState({ jobs: [], error: null, forKeyword: null }); // latest response

  // Re-fetch whenever `keyword` changes. A 300 ms delay ("debounce") avoids
  // one request per keystroke; the cleanup cancels the pending timer.
  useEffect(() => {
    let ignore = false;
    const term = keyword.trim();
    const id = setTimeout(() => {
      (term ? searchJobs(term) : getJobs())
        .then((jobs) => !ignore && setResult({ jobs: Array.isArray(jobs) ? jobs : [], error: null, forKeyword: keyword }))
        .catch(() => !ignore && setResult({ jobs: [], error: "Failed to fetch jobs. Please try again later.", forKeyword: keyword }));
    }, term ? 300 : 0);
    return () => {
      ignore = true;
      clearTimeout(id);
    };
  }, [keyword]);

  // Derived state: we are loading while the shown result belongs to an older keyword.
  const isLoading = result.forKeyword !== keyword;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-3xl font-bold text-gray-800">Available Jobs</h1>
          {/* only logged-in users can post; the functional update uses the latest list */}
          {isLoggedIn && (
            <AddJobButton onJobAdded={(job) => setResult((r) => ({ ...r, jobs: [job, ...r.jobs] }))} />
          )}
          <Link href="/" className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
            Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={setKeyword} />
        </div>

        {result.error && (
          <div role="alert" className="mb-8 border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
            <p>{result.error}</p>
          </div>
        )}

        {isLoading ? (
          <Spinner />
        ) : result.jobs.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No jobs found. Try adjusting your search.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.jobs.map((job) => (
              <JobCard key={job.postId} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
