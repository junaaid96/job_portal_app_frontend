// "/jobPosts/search?q=react": a SERVER Component (no "use client").
// It runs on the server, fetches data with await, and sends finished HTML to the browser.
import Link from "next/link";
import { searchJobs } from "@/app/lib/api";

export const dynamic = "force-dynamic"; // results depend on the query string: never pre-render

// Since Next.js 15, `searchParams` is a Promise and must be awaited.
export default async function SearchResults({ searchParams }) {
  const { q = "" } = await searchParams;
  const term = String(q).trim();

  let jobPosts = [];
  let failed = false;
  if (term) {
    try {
      jobPosts = await searchJobs(term);
    } catch {
      failed = true; // show a friendly message instead of crashing the page
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* A plain GET form: submitting navigates to ?q=..., no client JavaScript required */}
      <form action="/jobPosts/search" className="mb-8 flex gap-2">
        <label htmlFor="q" className="sr-only">Search jobs</label>
        <input id="q" name="q" type="search" defaultValue={term} placeholder="Search jobs..." className="rounded-lg border border-gray-300 p-2" />
        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">Search</button>
      </form>

      <h2 className="mb-4 text-2xl font-bold">Search Results for: {term}</h2>

      {failed ? (
        <p role="alert" className="text-red-600">Search failed. Please try again.</p>
      ) : jobPosts.length === 0 ? (
        <p>No jobs found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobPosts.map((job) => (
            <div key={job.postId} className="rounded-lg border border-gray-200 p-4">
              <h3 className="text-xl font-bold">{job.postProfile}</h3>
              <p className="my-6">{job.postDescription}</p>
              <Link href={`/jobPosts/${job.postId}`} className="mt-5 inline-block rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
