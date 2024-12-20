import Link from "next/link";
import searchJob from "@/app/lib/searchJob";
import { SearchBar } from "@/app/components/SearchBar";

export default async function SearchResults({ searchParams }) {
    const searchTerm = searchParams.q;
    let jobPosts = [];

    try {
        if (searchTerm) {
            jobPosts = await searchJob(searchTerm);
        }
    } catch (error) {
        console.error("Error searching jobs", error);
    }

    return (
        <div>
            <div className="mb-8">
                <SearchBar />
            </div>

            <h2 className="text-2xl font-bold mb-4">
                Search Results for: {searchTerm}
            </h2>
            
            {jobPosts.length === 0 ? (
                <p>No jobs found matching your search.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {jobPosts.map((jobPost) => (
                        <div
                            key={jobPost.postId}
                            className="p-4 border border-gray-200 rounded-lg"
                        >
                            <h2 className="text-xl font-bold">{jobPost.postProfile}</h2>
                            <p className="my-6">{jobPost.postDescription}</p>
                            <Link
                                href={`/jobPosts/${jobPost.postId}`}
                                className="inline-block px-4 py-2 mt-5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 