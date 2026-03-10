import { useState } from "react";
import { useRouter } from "next/router";
import { apiFetch } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginOrRegister } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      loginOrRegister(data);
      router.push("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="te-card p-8">
        <h1 className="text-2xl font-bold text-[#2d3436] mb-2">
          Welcome back
        </h1>
        <p className="text-[#636e72] mb-6">
          Log in to create and manage your travel experiences.
        </p>
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-2">
              Email
            </label>
            <input
              type="email"
              className="te-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d3436] mb-2">
              Password
            </label>
            <input
              type="password"
              className="te-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="te-primary-btn w-full">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-[#636e72]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="font-semibold text-[#e07c5c] hover:text-[#d47257]"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
