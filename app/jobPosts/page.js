"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import viewAllJobs from "@/app/lib/viewAllJobs";
import searchJob from "@/app/lib/searchJob";
import { SearchBar } from "@/app/components/SearchBar";
import { AddJobButton } from "@/app/components/AddJobButton";

export default function JobPosts() {
    const [jobPosts, setJobPosts] = useState([]);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobs = await viewAllJobs();
                setJobPosts(jobs);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };
        loadJobs();
    }, []);

    const handleSearch = async (searchValue) => {
        try {
            let results;
            if (searchValue.trim() === "") {
                results = await viewAllJobs();
            } else {
                results = await searchJob(searchValue);
            }
            setJobPosts(results);
        } catch (error) {
            console.error("Error searching jobs", error);
        }
    };

    const handleJobAdded = (newJob) => {
        setJobPosts([...jobPosts, newJob]);
    };

    return (
        <div>
            <div className="flex justify-center items-center gap-6 my-6">
                <SearchBar onSearch={handleSearch} />
                <AddJobButton onJobAdded={handleJobAdded} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 p-12">
                {jobPosts.map((jobPost) => (
                    <div
                        key={jobPost.postId}
                        className="p-4 border border-gray-200 rounded-lg"
                    >
                        <h2 className="text-xl font-bold">
                            {jobPost.postProfile}
                        </h2>
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
        </div>
    );
}
