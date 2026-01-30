"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error("API URL not configured")
const CUISINE_OPTIONS = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Continental",
  "Street Food",
  "Biryani",
  "Desserts",
  "Vegan",
];

type CookForm = {
  locationString: string;
  location: { type: "Point"; coordinates: number[] } | null;
  cuisines: string[];
  experience: number;
  price: number;
  availability: boolean;
  phoneNum: string;
};

type Cook = CookForm & {
  _id: string;
  status: "pending" | "approved" | "rejected";
  user: { name: string };
};

export default function CookPage() {
  const { user, token } = useAuth();

  const [form, setForm] = useState<CookForm>({
    locationString: "",
    location: null,
    cuisines: [],
    experience: 1,
    price: 200,
    availability: true,
    phoneNum: "",
  });

  const [myCook, setMyCook] = useState<Cook | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [geoDenied, setGeoDenied] = useState(false);
  const [requestingLocation, setRequestingLocation] = useState(true);

  // Fetch existing cook profile
  useEffect(() => {
    if (!user || !token) return;
    fetchMyCook();
  }, [user, token]);

  const fetchMyCook = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cooks/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;

      setMyCook(data);
      setForm({
        locationString: data.locationString || "",
        location: data.location || null,
        cuisines: data.cuisines || [],
        experience: data.experience || 1,
        price: data.price || 200,
        availability: data.availability ?? true,
        phoneNum: data.phoneNum || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Get browser location automatically
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoDenied(true);
      setRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        }));
        setRequestingLocation(false);
      },
      () => {
        setGeoDenied(true);
        setRequestingLocation(false);
      }
    );
  }, []);

  const toggleCuisine = (cuisine: string) => {
    setForm((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const submitCook = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.locationString) {
      setMessage("City / location is required");
      return;
    }

    if (!form.location) {
      setMessage("Allow location access or enter valid coordinates");
      return;
    }

    if (form.cuisines.length === 0) {
      setMessage("Select at least one cuisine");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phoneNum)) {
      setMessage("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/cooks", {
        method: myCook ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setMyCook(data);
      setMessage("Profile submitted for admin approval");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 px-4 py-24 flex justify-center">
      <div className="w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-white">
        <h1 className="text-2xl font-bold text-center mb-2">
          Cook Registration
        </h1>

        {requestingLocation && (
          <p className="mb-4 text-center text-indigo-300">
            📍 Please allow location access to help users discover you nearby
          </p>
        )}

        {message && (
          <p className="mb-4 text-center text-orange-300">{message}</p>
        )}

        <form onSubmit={submitCook} className="space-y-5">
          <input
            required
            placeholder="City / Location"
            value={form.locationString}
            onChange={(e) =>
              setForm({ ...form, locationString: e.target.value })
            }
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2"
          />

          {geoDenied && (
            <p className="text-sm text-orange-300">
              Location access denied. Nearby discovery may not work.
            </p>
          )}

          <input
            type="tel"
            required
            maxLength={10}
            placeholder="Phone Number"
            value={form.phoneNum}
            onChange={(e) =>
              setForm({ ...form, phoneNum: e.target.value })
            }
            className="w-full rounded-xl bg-black/30 border border-white/20 px-4 py-2"
          />

          <div>
            <label className="block text-sm mb-2">Cuisines</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CUISINE_OPTIONS.map((cuisine) => (
                <label
                  key={cuisine}
                  className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/20 px-3 py-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.cuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                    className="accent-indigo-500"
                  />
                  <span className="text-sm">{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              placeholder="Experience (years)"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: +e.target.value })
              }
              className="rounded-xl bg-black/30 border border-white/20 px-4 py-2"
            />
            <input
              type="number"
              min={50}
              placeholder="Price per meal (₹)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className="rounded-xl bg-black/30 border border-white/20 px-4 py-2"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.availability}
              onChange={(e) =>
                setForm({ ...form, availability: e.target.checked })
              }
              className="accent-indigo-500"
            />
            Available for orders
          </label>

          <button
            disabled={loading || myCook?.status === "pending"}
            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 font-semibold disabled:opacity-50"
          >
            {loading
              ? "Submitting..."
              : myCook
              ? "Update Profile"
              : "Submit Profile"}
          </button>
        </form>

        {myCook && (
          <div
            className={`mt-6 rounded-xl px-4 py-2 text-center font-semibold ${
              myCook.status === "approved"
                ? "bg-green-500/20 text-green-400"
                : myCook.status === "rejected"
                ? "bg-red-500/20 text-red-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            Status: {myCook.status.toUpperCase()}
            <br />
            <span className="text-sm">📞 {myCook.phoneNum}</span>
          </div>
        )}
      </div>
    </main>
  );
}
