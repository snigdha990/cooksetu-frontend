"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) throw new Error("API URL not configured")
  
export default function CookProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    location: "",
    cuisines: [] as string[],
    experience: "",
    price: "",
    availability: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const cuisineOptions = ["Indian", "Punjabi", "South Indian", "Chinese", "Jain", "Continental"]

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCuisineChange = (cuisine: string) => {
    setFormData(prev => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine) ? prev.cuisines.filter(c => c !== cuisine) : [...prev.cuisines, cuisine]
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Not authenticated")

      const res = await fetch(`${API_URL}/api/cooks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Profile creation failed")
      router.push("/admin") 
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-28 bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950">
      <div className="max-w-xl mx-auto rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Your Cook Profile</h1>
        {error && <p className="text-red-400 text-center mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" name="location" placeholder="City / Location" required onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-400" />
          <div>
            <p className="font-medium mb-3 text-white">Cuisines</p>
            <div className="grid grid-cols-2 gap-2">
              {cuisineOptions.map(cuisine => (
                <label key={cuisine} className="flex items-center gap-2 text-sm text-white/80">
                  <input type="checkbox" onChange={() => handleCuisineChange(cuisine)} className="accent-indigo-500" />
                  {cuisine}
                </label>
              ))}
            </div>
          </div>
          <input type="number" name="experience" placeholder="Experience (years)" required onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-400" />
          <input type="number" name="price" placeholder="Price per day (₹)" required onChange={handleChange}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-400" />
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 transition shadow-lg shadow-indigo-900/40">
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}
