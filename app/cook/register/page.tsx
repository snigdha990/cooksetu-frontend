"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error("API URL not configured");

export default function CookRegistrationPage() {
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    locationString: "",
    location: null as { type: "Point"; coordinates: number[] } | null,
    cuisines: [] as string[],
    experience: 1,
    price: 200,
    availability: true,
    phoneNum: "",
  });

  const [myCook, setMyCook] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [geoDenied, setGeoDenied] = useState(false);
  const [requestingLocation, setRequestingLocation] = useState(true);
  const [razorLoaded, setRazorLoaded] = useState(false);

  useEffect(() => {
    if (!user || !token) return;
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
      } finally {
        setRequestingLocation(false);
      }
    };
    fetchMyCook();
  }, [user, token]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoDenied(true);
      setRequestingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: {
            type: "Point",
            coordinates: [pos.coords.longitude, pos.coords.latitude],
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
    if (!form.locationString || !form.location || form.cuisines.length === 0) {
      setMessage("Please fill all required fields");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.phoneNum)) {
      setMessage("Enter a valid 10-digit phone number");
      return;
    }
    if (!razorLoaded) {
      setMessage("Payment gateway not loaded yet. Please wait...");
      return;
    }
    setLoading(true);
    try {
      const orderRes = await fetch(`${API_URL}/api/payment/create-registration-order`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.message || "Failed to create order");
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "CookSetu",
        description: "Cook Registration Fee",
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${API_URL}/api/payment/verify-registration`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              setMessage("Payment verification failed");
              return;
            }
            const cookRes = await fetch(
              myCook ? `${API_URL}/api/cooks/${myCook._id}` : `${API_URL}/api/cooks`,
              {
                method: myCook ? "PUT" : "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
              }
            );
            const cookData = await cookRes.json();
            if (!cookRes.ok) throw new Error(cookData.message);
            setMyCook(cookData);
            setMessage("Payment successful & profile submitted 🎉");
          } catch (err: any) {
            console.error(err);
            setMessage(err.message || "Something went wrong after payment");
          }
        },
        theme: { color: "#6366f1" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setRazorLoaded(true)}
      />
      <main className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 px-4 py-24 flex justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-white">
          <h1 className="text-2xl font-bold text-center mb-2">Cook Registration</h1>
          {requestingLocation && (
            <p className="mb-4 text-center text-indigo-300">
              📍 Please allow location access to help users discover you nearby
            </p>
          )}
          {message && <p className="mb-4 text-center text-orange-300">{message}</p>}
          <form onSubmit={submitCook} className="space-y-5">
            <input
              required
              placeholder="City / Location"
              value={form.locationString}
              onChange={(e) => setForm({ ...form, locationString: e.target.value })}
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
              onChange={(e) => setForm({ ...form, phoneNum: e.target.value })}
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
                onChange={(e) => setForm({ ...form, experience: +e.target.value })}
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
                onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                className="accent-indigo-500"
              />
              Available for orders
            </label>
            <button
              disabled={loading || myCook?.status === "pending" || !razorLoaded}
              className="w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : myCook ? "Update Profile" : "Submit & Pay ₹999"}
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
    </>
  );
}
