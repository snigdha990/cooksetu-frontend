"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Cook = {
  _id: string;
  locationString?: string;
  cuisines: string[];
  experience: number;
  price: number;
  availability: boolean;
  phoneNum: string;
  status: "pending" | "approved" | "rejected";
  user?: {
    _id: string;
    name: string;
    email?: string;
    phoneNum?: string;
    role: string;
  } | null;
};


const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error("API URL not configured")

export default function AdminCooksPage() {
  const { user, token } = useAuth();
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "admin") fetchCooks();
  }, [user, token]);

  const fetchCooks = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/cooks/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch cooks");
      setCooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (cookId: string, status: "approved" | "rejected") => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/cooks/${cookId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");

      setCooks((prev) =>
        prev.map((cook) => (cook._id === cookId ? { ...cook, status: data.status } : cook))
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Manage <span className="text-indigo-400">Cooks</span>
        </h1>
        <p className="text-white/60 mt-1">
          Review cook applications and manage approvals
        </p>
      </div>

      {error && <div className="mb-6 rounded-lg bg-red-500/20 text-red-300 px-4 py-2 text-sm">{error}</div>}

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {cooks.map((cook) => (
            <div
              key={cook._id}
              className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-5 text-white shadow-lg hover:shadow-indigo-700/40 transition"
            >
              <h2 className="text-lg font-semibold mb-1">
                {cook.user?.name || "Unknown User"}
              </h2>
              <p className="text-sm text-white/70 mb-2">{cook.locationString || "Location not provided"}</p>
              <p className="text-sm text-white/70 mb-2">{cook.phoneNum}</p>

              <div className="text-sm space-y-1">
                <p>
                  <span className="text-white/60">Cuisines:</span> {cook.cuisines.join(", ")}
                </p>
                <p>
                  <span className="text-white/60">Experience:</span> {cook.experience} yrs
                </p>
                <p>
                  <span className="text-white/60">Price:</span> ₹{cook.price}
                </p>
                <p>
                  <span className="text-white/60">Availability:</span>{" "}
                  {cook.availability ? "Available" : "Unavailable"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    cook.status === "approved"
                      ? "text-green-400"
                      : cook.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {cook.status.toUpperCase()}
                </span>

                {user?.role === "admin" && cook.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(cook._id, "approved")}
                      className="rounded-lg bg-green-500 px-3 py-1 text-sm font-semibold hover:opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(cook._id, "rejected")}
                      className="rounded-lg bg-red-500 px-3 py-1 text-sm font-semibold hover:opacity-90"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
