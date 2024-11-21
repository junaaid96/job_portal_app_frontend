"use client";

import { useState } from "react";

export function AddJobButton({ onJobAdded }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobData, setJobData] = useState({
        postProfile: "",
        postDescription: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/jobPost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (!response.ok) {
                throw new Error('Failed to add job');
            }

            const newJob = await response.json();
            onJobAdded(newJob);
            setIsModalOpen(false);
            setJobData({ postProfile: "", postDescription: "" });
        } catch (error) {
            console.error('Error adding job:', error);
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Job</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Profile Title</label>
                                <input
                                    type="text"
                                    value={jobData.postProfile}
                                    onChange={(e) => setJobData({...jobData, postProfile: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    value={jobData.postDescription}
                                    onChange={(e) => setJobData({...jobData, postDescription: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    rows="4"
                                    required
                                />
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