import {useState, useEffect} from "react";
import Link from "next/link";
import decodeJWT from "@/app/utils/decodeJWT";
import viewAllJobs from "@/app/lib/viewAllJobs";

const Dashboard = ({ token, handleLogout }) => {
    const username = decodeJWT(token).sub;
    const [jobPosts, setJobPosts] = useState([]);

    useEffect(() => {
        const loadJobs = async () => {
            const jobs = await viewAllJobs();
            setJobPosts(jobs);
        };
        loadJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Navigation Bar */}
            <nav className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Hello, {username}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-gray-600 mb-2">Total Applications</div>
                    <div className="text-3xl font-bold">{jobPosts.length}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-gray-600 mb-2">Active Jobs</div>
                    <div className="text-3xl font-bold">8</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-gray-600 mb-2">Interviews</div>
                    <div className="text-3xl font-bold">3</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/jobPosts"
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="text-xl font-semibold mb-2">Find Jobs</h3>
                    <p className="text-gray-600">
                        Browse and apply for new opportunities
                    </p>
                </Link>

                <Link
                    href="/applications"
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="text-xl font-semibold mb-2">
                        My Applications
                    </h3>
                    <p className="text-gray-600">Track your job applications</p>
                </Link>

                <Link
                    href="/profile"
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="text-xl font-semibold mb-2">Profile</h3>
                    <p className="text-gray-600">Update your information</p>
                </Link>

                <Link
                    href="/settings"
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <h3 className="text-xl font-semibold mb-2">Settings</h3>
                    <p className="text-gray-600">Manage your preferences</p>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
