"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNum: "",
    role: "user" as "user" | "cook",
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
    locationString: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            locationString: "Current location",
          }));
        },
        (err) => console.warn("Geolocation denied or unavailable", err)
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.lat === undefined || form.lng === undefined) {
      setLoading(false);
      setError("Unable to detect location. Please allow location access.");
      return;
    }

    const success = await signup(form);
    setLoading(false);

    if (!success) {
      setError("Failed to sign up. Try again.");
      return;
    }

    if (form.role === "user") router.push("/enable-location");
    else if (form.role === "cook") router.push("/cook/register");
    else router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-violet-900/40 backdrop-blur-xl shadow-2xl shadow-indigo-900/40 p-8">
        <h1 className="text-2xl font-bold text-white text-center">
          Create your <span className="text-indigo-400">CookSetu Hub</span> account
        </h1>

        {error && (
          <div className="mt-4 rounded-lg bg-red-500/20 text-red-300 px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Akhil" },
            { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
            { label: "Password", key: "password", type: "password", placeholder: "••••••••" },
            { label: "Phone Number", key: "phoneNum", type: "text", placeholder: "+91 98765 43210" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm text-white/80 mb-1">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form] || ""}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                required
                placeholder={field.placeholder}
                className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-white/80 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as "user" | "cook" })}
              className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="user">User</option>
              <option value="cook">Cook</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full mt-2 bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 font-semibold text-white shadow-lg shadow-purple-600/40 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/70">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
