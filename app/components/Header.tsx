"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NAV_LINKS = [
  { name: "Find Cooks", href: "/cooks" },
  { name: "Become a Cook", href: "/cook/register" },
  { name: "Admin-Page", href: "/admin" }
];

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mt-4 rounded-3xl border border-white/20 bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-violet-900/30 backdrop-blur-lg shadow-lg shadow-indigo-900/40">
          <div className="flex h-16 items-center justify-between px-6">
            <Link href="/" className="flex items-center gap-1 text-lg font-semibold tracking-tight text-white">
              <motion.h3
                  className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  CookSetu
              </motion.h3>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-white/80">
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} className="text-md font-medium hover:text-indigo-400 transition">
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-4 relative">
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle theme"
                className="rounded-full p-2 text-white hover:bg-white/10 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </motion.button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white font-semibold uppercase hover:opacity-90 transition"
                  >
                    {user.name.charAt(0)}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-lg rounded-xl shadow-lg shadow-black/50 overflow-hidden z-50">
                      <div className="px-4 py-2 text-white border-b border-white/20">
                        <p className="font-semibold">{user.name}</p>
                        {user.role && (
                          <p className="text-sm text-white/60">
                            {user.role.toUpperCase()}
                          </p>
                        )}
                      </div>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="rounded-full px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-600/40 hover:opacity-90 transition">
                    Login
                  </Link>
                  <Link href="/sign-up" className="rounded-full px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/40 hover:opacity-90 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden rounded-lg p-2 text-white hover:bg-white/10 transition">
              {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
          {mobileOpen && (
            <motion.div
              className="md:hidden border-t border-white/30 px-6 py-5 space-y-4 text-white"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium hover:text-indigo-400 transition">
                  {link.name}
                </Link>
              ))}

              <button onClick={() => setDarkMode(!darkMode)} className="flex items-center gap-2 text-sm">
                {darkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                {darkMode ? "Light mode" : "Dark mode"}
              </button>

              {user ? (
                <button onClick={logout} className="block text-sm font-medium mt-2">Logout</button>
              ) : (
                <>
                  <Link href="/login" className="block text-sm font-medium mt-2">Login</Link>
                  <Link href="/sign-up" className="block text-sm font-medium mt-2">Sign Up</Link>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}
