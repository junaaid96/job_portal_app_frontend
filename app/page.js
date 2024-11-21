import Link from "next/link";
import viewAllJobs from "./lib/viewAllJobs";

export default async function Home() {
    let jobPosts = [];
    try {
        jobPosts = await viewAllJobs();
    } catch (error) {
        console.error("Error fetching services", error);
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <p>Total Job Posts: {jobPosts.length}</p>

            <Link
                href="/jobPosts"
                className="inline-block px-4 py-2 mt-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
            >
                View All Job Posts
            </Link>
        </div>
    );
}
