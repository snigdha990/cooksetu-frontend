"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL
if (!API_URL) throw new Error("API URL not configured")

// User type matching backend schema
type User = {
  _id: string
  name: string
  email?: string
  role: "user" | "cook" | "admin"
  phoneNum?: string
  location?: {
    type: "Point"
    coordinates: [number, number]
  }
  locationString?: string
}

type SignupData = {
  name: string
  email: string
  password: string
  phoneNum: string
  role?: "user" | "cook"
  lat?: number
  lng?: number
  locationString?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: SignupData) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  // Load saved auth from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Login failed")

      setUser(data.user)
      setToken(data.token)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      // Optional redirect after login
      router.push("/dashboard")
      return true
    } catch (err) {
      console.error("Login error:", err)
      return false
    }
  }

  // SIGNUP
  const signup = async (data: SignupData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Signup failed")

      setUser(result.user)
      setToken(result.token)
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      // Optional redirect after signup
      router.push("/dashboard")
      return true
    } catch (err) {
      console.error("Signup error:", err)
      return false
    }
  }

  // LOGOUT
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
