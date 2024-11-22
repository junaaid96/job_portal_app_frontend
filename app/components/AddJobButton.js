"use client";

import { useState } from "react";

export function AddJobButton({ onJobAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobData, setJobData] = useState({
        postId: "",
        postProfile: "",
        postDescription: "",
        requiredExperience: "",
        postTechStack: [],
    });

    const techStackOptions = [
        "JavaScript",
        "Python",
        "Java",
        "React",
        "Node.js",
        "Angular",
        "Vue.js",
        "Spring Boot",
        "MongoDB",
        "PostgreSQL",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/jobPost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(jobData),
            });

            if (!response.ok) {
                throw new Error("Failed to add job");
            }

            const newJob = await response.json();
            onJobAdded(newJob);
            setIsModalOpen(false);
            setJobData({
                postId: "",
                postProfile: "",
                postDescription: "",
                requiredExperience: "",
                postTechStack: [],
            });
        } catch (error) {
            console.error("Error adding job:", error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
            >
                Add New Job
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg w-2/3 my-8 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Job</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Job ID</label>
                                <input
                                    type="number"
                                    value={jobData.postId}
                                    onChange={(e) =>
                                        setJobData({
                                            ...jobData,
                                            postId: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={jobData.postProfile}
                                    onChange={(e) =>
                                        setJobData({
                                            ...jobData,
                                            postProfile: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    Job Description
                                </label>
                                <textarea
                                    value={jobData.postDescription}
                                    onChange={(e) =>
                                        setJobData({
                                            ...jobData,
                                            postDescription: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">
                                    Required Experience
                                </label>
                                <input
                                    type="number"
                                    value={jobData.requiredExperience}
                                    onChange={(e) =>
                                        setJobData({
                                            ...jobData,
                                            requiredExperience: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Job Tech Stack</label>
                                <select
                                    multiple
                                    value={jobData.postTechStack}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        );
                                        setJobData({
                                            ...jobData,
                                            postTechStack: selectedOptions,
                                        });
                                    }}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    {techStackOptions.map((tech) => (
                                        <option key={tech} value={tech}>
                                            {tech}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-sm text-gray-500 mt-1">
                                    Hold Ctrl/Cmd to select multiple technologies
                                </p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
