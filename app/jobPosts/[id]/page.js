"use client";
import { useState, useEffect, use } from "react";
import viewAJob from "@/app/lib/viewAJob";

export default function JobPostDetails({ params }) {
    const id = use(params).id;
    const [jobPost, setJobPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        postId: "",
        postProfile: "",
        postDescription: "",
        requiredExperience: "",
        postTechStack: "",
    });

    useEffect(() => {
        const fetchJob = async () => {
            const job = await viewAJob(id);
            setJobPost(job);
            setFormData({
                postId: job.postId,
                postProfile: job.postProfile,
                postDescription: job.postDescription,
                requiredExperience: job.requiredExperience,
                postTechStack: job.postTechStack.join(", "),
            });
        };
        fetchJob();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/jobPost`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: id,
                    ...formData,
                    postTechStack: formData.postTechStack
                        .split(",")
                        .map((skill) => skill.trim()),
                }),
            });

            if (response.ok) {
                setIsEditing(false);
                // Refresh the job data
                const updatedJob = await viewAJob(id);
                setJobPost(updatedJob);
            }
        } catch (error) {
            console.error("Error updating job post:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this job post?")) {
            try {
                const response = await fetch(
                    `http://localhost:8080/jobPost/${id}`,
                    {
                        method: "DELETE",
                    }
                );

                if (response.ok) {
                    // Redirect to the jobs listing page after successful deletion
                    window.location.href = "/jobPosts";
                }
            } catch (error) {
                console.error("Error deleting job post:", error);
            }
        }
    };

    if (!jobPost) return <div>Loading...</div>;

    return (
        <div className="w-1/3 m-auto mt-12">
            {!isEditing ? (
                <>
                    <h1 className="text-3xl font-bold">
                        {jobPost.postProfile}
                    </h1>
                    <p className="my-6">{jobPost.postDescription}</p>
                    <p>Required Experience: {jobPost.requiredExperience}</p>
                    <p>Skills: {jobPost.postTechStack.join(", ")}</p>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Edit Job Post
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Delete Job Post
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="mb-4">
                        <label className="block mb-2">Job Title:</label>
                        <input
                            type="text"
                            value={formData.postProfile}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    postProfile: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Description:</label>
                        <textarea
                            value={formData.postDescription}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    postDescription: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                            rows="4"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            Required Experience:
                        </label>
                        <input
                            type="text"
                            value={formData.requiredExperience}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    requiredExperience: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">
                            Tech Stack (comma-separated):
                        </label>
                        <input
                            type="text"
                            value={formData.postTechStack}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    postTechStack: e.target.value,
                                })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
