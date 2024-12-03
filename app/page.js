"use client";

import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        // Check if there's a token in localStorage on component mount
        const storedToken = localStorage.getItem("token");
        const expirationTime = localStorage.getItem("tokenExpiration");

        if (storedToken && expirationTime) {
            const currentTime = new Date().getTime();
            if (currentTime > expirationTime) {
                // Token is expired
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiration");
                setToken("");
                window.location.reload();
            } else {
                // Token is valid
                setToken(storedToken);
                // Schedule token removal
                const timeLeft = expirationTime - currentTime;
                setTimeout(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("tokenExpiration");
                    setToken("");
                    window.location.reload();
                }, timeLeft);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin
            ? "http://localhost:8080/login"
            : "http://localhost:8080/register";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (isLogin) {
                const token = await response.text();
                if (token && token !== "Invalid username or password") {
                    const expirationTime =
                        new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now

                    // Store token and expiration time in localStorage
                    localStorage.setItem("token", token);
                    localStorage.setItem("tokenExpiration", expirationTime);

                    setToken(token);

                    // Schedule token removal
                    setTimeout(() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("tokenExpiration");
                        setToken("");
                        window.location.reload();
                    }, 30 * 60 * 1000); // 30 minutes
                    setError("");
                } else {
                    setError("Invalid credentials");
                }
            } else {
                const data = await response.json();
                if (response.ok) {
                    setIsLogin(true);
                    setError("Registration successful! Please login.");
                    setFormData({ username: "", password: "" }); // Clear form after successful registration
                } else {
                    setError("Registration failed");
                }
            }
        } catch (error) {
            setError("An error occurred");
            console.error("Error:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setToken("");
        setFormData({ username: "", password: "" });
        window.location.reload();
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-2xl font-bold border p-3 shadow">
                Job Portal App
            </h1>

            {!token ? (
                <div className="w-full max-w-md">
                    <h1 className="text-xl font-semibold mb-6 text-center">
                        {isLogin ? "Login" : "Register"}
                    </h1>

                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                        >
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </form>

                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full mt-4 text-blue-500 hover:text-blue-700"
                    >
                        {isLogin
                            ? "Need an account? Register"
                            : "Have an account? Login"}
                    </button>
                </div>
            ) : (
                <Dashboard token={token} handleLogout={handleLogout} />
            )}
        </div>
    );
}
