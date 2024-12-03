"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import viewAllJobs from "@/app/lib/viewAllJobs";
import searchJob from "@/app/lib/searchJob";
import { SearchBar } from "@/app/components/SearchBar";
import { AddJobButton } from "@/app/components/AddJobButton";
import { motion } from "framer-motion";

export default function JobPosts() {
    const [jobPosts, setJobPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                setIsLoading(true);
                const jobs = await viewAllJobs();
                setJobPosts(jobs);
            } catch (error) {
                // setError("Failed to fetch jobs. Please try again later.");
                console.error("Error fetching jobs", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadJobs();
    }, []);

    const handleSearch = async (keyword) => {
        try {
            setIsLoading(true);
            const searchResults = await searchJob(keyword);
            setJobPosts(searchResults);
        } catch (error) {
            // setError("Search failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Available Jobs
                    </h1>
                    <AddJobButton
                        onJobAdded={(job) => setJobPosts([job, ...jobPosts])}
                    />
                    <Link href="/" className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                            Dashboard                      
                    </Link>
                </div>

                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {error && (
                    <div
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8"
                        role="alert"
                    >
                        <p>{error}</p>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobPosts.map((job) => (
                            <motion.div
                                key={job.postId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <Link href={`/jobPosts/${job.postId}`}>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                            {job.postProfile}
                                        </h2>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {job.postDescription}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {job.postTechStack.map(
                                                (tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>
                                                Experience:{" "}
                                                {job.requiredExperience} years
                                            </span>
                                            <span>
                                                Posted by: {job.addedBy}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {!isLoading && jobPosts.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No jobs found. Try adjusting your search.
                    </div>
                )}
            </div>
        </div>
    );
}
