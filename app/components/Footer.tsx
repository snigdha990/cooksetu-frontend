"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  const socialIcons = [
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaInstagram />, link: "#" },
    { icon: <FaYoutube />, link: "#" },
    { icon: <FaFacebook />, link: "#" },
    { icon: <FaLinkedin />, link: "#" },
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="relative w-full bg-[#011426] text-indigo-100 overflow-hidden">
        <hr />
      <div
        className={`absolute -top-24 left-1/4 rounded-full blur-3xl pointer-events-none
        ${isMobile ? "w-40 h-40" : "w-72 h-72"} bg-indigo-500/20`}
      />
      <div
        className={`absolute -bottom-24 right-1/4 rounded-full blur-3xl pointer-events-none
        ${isMobile ? "w-48 h-48" : "w-80 h-80"} bg-purple-500/20`}
      />

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <motion.h3
              className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              CookSetu
            </motion.h3>
            <p className="text-indigo-300/80 text-sm leading-relaxed">
              Connecting households with trusted, verified home cooks for daily
              meals and special occasions. Simple, reliable, and local.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold text-white">Platform</h4>
            <Link href="/cooks" className="hover:text-indigo-400 transition">
              Find a Cook
            </Link>
            <Link
              href="/cook/register"
              className="hover:text-indigo-400 transition"
            >
              Become a Cook
            </Link>
            <Link
              href="#business-model"
              className="hover:text-indigo-400 transition"
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-indigo-400 transition"
            >
              How It Works
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <Link
              href="#about-us"
              className="hover:text-indigo-400 transition"
            >
              About Us
            </Link>
            <Link
              href="#features"
              className="hover:text-indigo-400 transition"
            >
              Features
            </Link>
            <Link
              href="#business-model"
              className="hover:text-indigo-400 transition"
            >
              Business Strategy
            </Link>
            <Link href="#" className="hover:text-indigo-400 transition">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Stay Connected</h4>
            <p className="text-sm text-indigo-300/80">
              Follow us for updates, new features, and community stories.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((s, i) => (
                <motion.a
                  key={i}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 text-xl transition-colors"
                  whileHover={{ scale: 1.15, color: "#a855f7" }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-indigo-500/20 mt-10 pt-6 text-center">
          <p className="text-sm text-indigo-300/70">
            &copy; {new Date().getFullYear()} CookSetu. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
