"use client";

import { useRouter } from "next/navigation";

export default function EnableLocationPage() {
  const router = useRouter();

  const requestLocation = () => {
    if (!navigator.geolocation) {
      router.push("/cooks");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // OPTIONAL: send to backend
        // await fetch("/api/users/location", { ... });

        router.push("/cooks");
      },
      () => {
        router.push("/cooks");
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 to-violet-950 px-6">
      <div className="max-w-md text-center bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
        <h1 className="text-2xl font-bold text-white mb-4">
          Enable Location
        </h1>

        <p className="text-white/70 mb-6">
          We use your location to show cooks near you.
          This helps you find trusted home cooks faster.
        </p>

        <button
          onClick={requestLocation}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90"
        >
          Allow Location
        </button>

        <button
          onClick={() => router.push("/cooks")}
          className="mt-4 text-sm text-white/60 underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
