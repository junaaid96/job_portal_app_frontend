"use client";

import { useActionState, useState } from "react";
import { login, register } from "@/app/lib/api";

/**
 * Login / register form using React 19 "Actions".
 * useActionState(action, initialState) gives us:
 *   state     - whatever the action returned last time
 *   formAction- pass to <form action={...}>; React calls it with the FormData
 *   isPending - true while the async action runs (great for disabling the button)
 */
export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const isLogin = mode === "login";

  const [state, formAction, isPending] = useActionState(
    async (_prevState, formData) => {
      // FormData comes from the inputs' `name` attributes; no onChange handlers needed.
      const credentials = {
        username: String(formData.get("username") ?? "").trim(),
        password: String(formData.get("password") ?? ""),
      };
      try {
        if (isLogin) {
          const token = (await login(credentials)).trim(); // backend returns raw JWT text
          onLogin(token); // hand the token to the parent (stores it)
          return { error: null, message: null };
        }
        await register(credentials); // 201 Created on success
        setMode("login"); // switch to login so the user can sign in
        return { error: null, message: "Registration successful! Please log in." };
      } catch (err) {
        // 401/403 on login means wrong credentials; anything else is a generic failure
        const msg = isLogin && [401, 403].includes(err.status) ? "Invalid username or password" : err.message;
        return { error: msg || "Something went wrong", message: null };
      }
    },
    { error: null, message: null } // initial state
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-6 text-center text-xl font-semibold">{isLogin ? "Login" : "Register"}</h2>

      {/* Conditional rendering: only show a paragraph when there is something to say */}
      {state.error && <p role="alert" className="mb-4 text-center text-red-500">{state.error}</p>}
      {state.message && <p className="mb-4 text-center text-green-600">{state.message}</p>}

      {/* `action` instead of `onSubmit`: React handles preventDefault and pending state */}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="username" className="mb-2 block">Username</label>
          <input id="username" name="username" type="text" autoComplete="username" required className="w-full rounded border p-2" />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
            className="w-full rounded border p-2"
          />
        </div>
        <button
          type="submit"
          disabled={isPending} // prevent double submits
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Please wait…" : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode(isLogin ? "register" : "login")} // toggle between the two modes
        className="mt-4 w-full text-blue-500 hover:text-blue-700"
      >
        {isLogin ? "Need an account? Register" : "Have an account? Login"}
      </button>
    </div>
  );
}
