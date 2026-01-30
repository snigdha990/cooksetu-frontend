"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatedBadge } from "./AnimatedBadge";

export default function HeroSection() {
  const [shapes, setShapes] = useState<
    { size: number; top: string; left: string; color: string; duration: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 4 }).map((_, i) => ({
      size: 200 + Math.random() * 150,
      top: `${10 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 70}%`,
      color:
        i === 0
          ? "rgba(168,85,247,0.15)"
          : i === 1
          ? "rgba(99,102,241,0.15)"
          : i === 2
          ? "rgba(56,189,248,0.15)"
          : "rgba(236,72,153,0.15)",
      duration: 30 + Math.random() * 20,
    }));
    setShapes(generated);
  }, []);

  return (
    <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 overflow-hidden text-center">
      <div className="absolute inset-0 -z-10">
        {shapes.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.size,
              height: s.size,
              top: s.top,
              left: s.left,
              background: s.color,
              filter: "blur(100px)",
            }}
            animate={{ y: [0, 20, 0], x: [0, 15, 0] }}
            transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute w-[4600px] h-[900px] rounded-full bg-gradient-to-tr from-purple-400/25 via-indigo-400/25 to-sky-400/25 -z-20"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        <div className="mb-6">
          <AnimatedBadge />
        </div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white max-w-5xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Find{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent animate-shimmer">
            Trusted Home Cooks
          </span>{" "}
          Near You
        </motion.h1>

        <motion.p
          className="mt-6 text-base md:text-lg lg:text-xl text-white/80 max-w-4xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Hire admin-verified home cooks for daily meals, family gatherings, and special occasions. Hygienic, reliable, and tailored to your taste.
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Link
            href="/cooks"
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/40 hover:opacity-90 transition"
          >
            Find a Cook
          </Link>

          <Link
            href="/cook/register"
            className="px-10 py-4 rounded-xl border border-white/30 text-white/80 hover:bg-white/10 transition"
          >
            Become a Cook
          </Link>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-6 text-sm md:text-base text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <span>✔ Admin Verified</span>
          <span>✔ Local & Experienced</span>
          <span>✔ Transparent Pricing</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
