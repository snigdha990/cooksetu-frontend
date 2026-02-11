"use client";

import { useEffect, useState } from "react";

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

interface Cook {
  _id: string;
  user: { name: string };
  locationString?: string;
  location?: { type: "Point"; coordinates: number[] } | null;
  cuisines: string[];
  experience: number;
  phoneNum: string;
  price: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error("API URL not configured");

function CookCardSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg animate-pulse">
      <div className="h-6 w-2/3 bg-white/20 rounded mb-3" />
      <div className="h-4 w-1/2 bg-white/15 rounded mb-4" />

      <div className="space-y-2">
        <div className="h-4 w-full bg-white/15 rounded" />
        <div className="h-4 w-3/4 bg-white/15 rounded" />
      </div>

      <div className="h-5 w-1/3 bg-white/20 rounded mt-4" />
      <div className="h-10 w-full bg-white/20 rounded-xl mt-5" />
    </div>
  );
}

export default function CooksPage() {
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(true);
  const [manualLocation, setManualLocation] = useState("");
  const [cuisine, setCuisine] = useState("");

  useEffect(() => {
    const fetchCooks = async (lat?: number, lng?: number) => {
      try {
        const url =
          lat !== undefined && lng !== undefined
            ? `${API_URL}/api/cooks/nearby?lat=${lat}&lng=${lng}`
            : `${API_URL}/api/cooks`;

        const res = await fetch(url);
        const data = await res.json();
        const cooksArray: Cook[] = Array.isArray(data) ? data : [];

        const validCooks = cooksArray.filter((c) => {
          if (lat !== undefined && lng !== undefined) {
            return c.location?.coordinates?.length === 2;
          }
          return true;
        });

        setCooks(validCooks);
      } catch (err) {
        console.error("Error fetching cooks:", err);
        setCooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setLocationAllowed(false);
      fetchCooks();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchCooks(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLocationAllowed(false);
        fetchCooks();
      }
    );
  }, []);

  const filtered = cooks.filter((c) => {
    const matchesLocation =
      locationAllowed || manualLocation === ""
        ? true
        : c.locationString
            ?.toLowerCase()
            .includes(manualLocation.toLowerCase());

    const matchesCuisine =
      cuisine === "" || c.cuisines.includes(cuisine);

    return matchesLocation && matchesCuisine;
  });

  return (
    <div className="min-h-screen px-6 py-28 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Find a Cook</h1>
        <p className="text-white/70 mb-8">
          Hire trusted home cooks based on your location & cuisine
        </p>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {!locationAllowed && (
            <input
              type="text"
              placeholder="Enter your city"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-400"
            />
          )}

          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="p-3 rounded-xl bg-black/30 border border-white/20 text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="">All Cuisines</option>
            {CUISINE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Cook Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <CookCardSkeleton key={i} />
              ))
            : filtered.map((cook) => (
                <div
                  key={cook._id}
                  className="rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg hover:shadow-indigo-900/40 transition"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {cook.locationString || "Location hidden"}
                  </h2>
                  
                  <p className="text-sm mt-3 text-white/70">
                    🍲 {cook.cuisines.join(", ")}
                  </p>
                  <p className="text-sm mt-1 text-white/70">
                    ⭐ {cook.experience} years experience
                  </p>

                  <p className="text-md font-bold mt-2 text-indigo-400">
                    📞 {cook.phoneNum}
                  </p>
                  <p className="text-lg font-bold mt-4 text-indigo-300">
                    ₹{cook.price}/day
                  </p>

                  <button className="mt-5 w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 transition">
                    View Profile
                  </button>
                </div>
              ))}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-white/50 mt-12 col-span-full">
              No cooks found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
