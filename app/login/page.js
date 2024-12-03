"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TOKEN_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

export default function Login() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Request failed');
            }

            if (isLogin) {
                handleLoginSuccess(responseText);
            } else {
                handleRegistrationSuccess();
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        }
    };

    const handleLoginSuccess = (responseText) => {
        try {
            const data = JSON.parse(responseText);
            const token = data.token || responseText;

            // Store token with expiration time
            const expirationTime = new Date().getTime() + TOKEN_EXPIRATION_TIME;
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiration', expirationTime.toString());

            // Set timeout to clear token and redirect
            const timeoutId = setTimeout(clearTokenAndRedirect, TOKEN_EXPIRATION_TIME);

            // Store timeout ID for cleanup
            window.tokenExpirationTimeout = timeoutId;

            router.push('/');
        } catch (parseError) {
            console.error('Error parsing token:', parseError);
            localStorage.setItem('token', responseText);
            router.push('/');
        }
    };

    const handleRegistrationSuccess = () => {
        setIsLogin(true);
        setFormData({ username: formData.username, password: '' });
        alert('Registration successful! Please login.');
    };

    const clearTokenAndRedirect = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        window.location.reload();
    };

    // Add this useEffect at the top level of your component
    useEffect(() => {
        // Check token expiration on mount
        const token = localStorage.getItem('token');
        const expirationTime = localStorage.getItem('tokenExpiration');

        if (token && expirationTime) {
            const currentTime = new Date().getTime();
            const timeLeft = parseInt(expirationTime) - currentTime;

            if (timeLeft <= 0) {
                // Token has expired
                clearTokenAndRedirect();
            } else {
                // Set timeout for remaining time
                const timeoutId = setTimeout(clearTokenAndRedirect, timeLeft);
                window.tokenExpirationTimeout = timeoutId;
            }
        }

        // Cleanup on unmount
        return () => {
            if (window.tokenExpirationTimeout) {
                clearTimeout(window.tokenExpirationTimeout);
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm">{error}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}