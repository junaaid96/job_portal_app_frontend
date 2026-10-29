"use client"; // this page reads localStorage and uses hooks, so it runs in the browser

import { useAuth } from "@/app/hooks/useAuth";
import { useMounted } from "@/app/hooks/useMounted";
import AuthForm from "@/app/components/AuthForm";
import Dashboard from "@/app/components/Dashboard";
import Spinner from "@/app/components/Spinner";

/** Home route ("/"): shows the login form, or the dashboard when logged in. */
export default function Home() {
  const { isLoggedIn, username, login, logout } = useAuth();
  const mounted = useMounted(); // auth lives in localStorage, unknown during server render

  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-8 sm:p-20">
      <h1 className="border p-3 text-2xl font-bold shadow">Job Portal App</h1>
      {/* nested ternary: loading -> dashboard -> login form */}
      {!mounted ? <Spinner /> : isLoggedIn ? <Dashboard username={username} onLogout={logout} /> : <AuthForm onLogin={login} />}
    </main>
  );
}
