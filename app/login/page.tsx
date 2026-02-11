"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationString, setLocationString] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLocationString("Current location");
        },
        (err) => console.warn("Geolocation denied or unavailable", err)
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      setError("Invalid email or password");
      return;
    }

    if (lat !== null && lng !== null) {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/location`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ lat, lng, locationString }),
          });
        }
      } catch (err) {
        console.warn("Failed to update location after login", err);
      }
    }

    router.push("/"); // redirect after login
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-violet-900/40 backdrop-blur-xl shadow-2xl shadow-indigo-900/40 p-8">
        <h1 className="text-2xl font-bold text-white text-center">
          Login to <span className="text-indigo-400">CookSetu Hub</span>
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/20 text-red-300 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full mt-2 bg-gradient-to-r from-indigo-500 to-violet-500 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/40 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Don’t have an account?{" "}
          <a href="/sign-up" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
