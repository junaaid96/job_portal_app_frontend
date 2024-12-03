"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import viewAJob from "@/app/lib/viewAJob";
import decodeJWT from "@/app/utils/decodeJWT";

export default function JobPostDetails({ params }) {
    const { id } = use(params);
    const [jobPost, setJobPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        postId: "",
        postProfile: "",
        postDescription: "",
        requiredExperience: "",
        postTechStack: "",
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setIsLoading(true);
                const job = await viewAJob(id);
                setJobPost(job);
                setFormData({
                    postId: job.postId,
                    postProfile: job.postProfile,
                    postDescription: job.postDescription,
                    requiredExperience: job.requiredExperience,
                    postTechStack: job.postTechStack.join(", "),
                });
            } catch (err) {
                setError("Failed to load job details");
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const username = decodeJWT(token).sub;

            await axios.put(`http://localhost:8080/jobPost`, {
                postId: id,
                ...formData,
                addedBy: username,
                postTechStack: formData.postTechStack
                    .split(",")
                    .map((skill) => skill.trim()),
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const updatedJob = await viewAJob(id);
            setJobPost(updatedJob);
            setIsEditing(false);
        } catch (error) {
            setError("Failed to update job post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this job post?")) return;
        
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/jobPost/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            window.location.href = "/jobPosts";
        } catch (error) {
            setError("Failed to delete job post");
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const username = decodeJWT(localStorage.getItem('token')).sub;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div 
                className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence mode="wait">
                    {!isEditing ? (
                        <motion.div
                            key="view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6"
                        >
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{jobPost.postProfile}</h1>
                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-600">{jobPost.postDescription}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-semibold text-gray-700">Required Experience</h3>
                                    <p>{jobPost.requiredExperience} years</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded">
                                    <h3 className="font-semibold text-gray-700">Posted By</h3>
                                    <p>{jobPost.addedBy}</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-700 mb-2">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {jobPost.postTechStack.map((tech, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {username === jobPost.addedBy && (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Edit Job Post
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete Job Post
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.form
                            key="edit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 space-y-6"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.postProfile}
                                    onChange={(e) => setFormData({ ...formData, postProfile: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Description
                                </label>
                                <textarea
                                    value={formData.postDescription}
                                    onChange={(e) => setFormData({ ...formData, postDescription: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Required Experience (years)
                                </label>
                                <input
                                    type="number"
                                    value={formData.requiredExperience}
                                    onChange={(e) => setFormData({ ...formData, requiredExperience: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Required Skills (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.postTechStack}
                                    onChange={(e) => setFormData({ ...formData, postTechStack: e.target.value })}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}