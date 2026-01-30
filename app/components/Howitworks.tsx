"use client";

import { motion } from "framer-motion";
import {
  UserIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

const steps = [
  {
    title: "Sign Up & Create Profile",
    description:
      "Register as a user or cook and set up your profile with cuisines, experience, and availability.",
    icon: UserIcon,
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
  },
  {
    title: "Browse & Select Cook",
    description:
      "Explore verified cooks, view profiles, cuisines, pricing, and experience.",
    icon: MagnifyingGlassIcon,
    gradient: "from-cyan-400 via-blue-400 to-indigo-500",
  },
  {
    title: "Book Home Service",
    description:
      "Choose date & time, confirm booking, and get service at your home.",
    icon: HomeIcon,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  {
    title: "Enjoy & Review",
    description:
      "Enjoy freshly prepared meals and share feedback to maintain quality.",
    icon: ClipboardDocumentCheckIcon,
    gradient: "from-yellow-400 via-orange-400 to-red-500",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative max-w-4xl mx-auto px-6 py-20 text-white"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        How It Works
      </motion.h2>

      <div className="relative flex flex-col items-center">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/40 to-pink-500/40" />

        <div className="flex flex-col gap-20 w-full">
          {steps.map(({ title, description, icon: Icon, gradient }, i) => (
            <motion.div
              key={title}
              className="relative flex flex-col items-center text-center max-w-xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <motion.div
                className={`relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center shadow-xl mb-6`}
                whileHover={{ scale: 1.2 }}
              >
                <Icon className="w-7 h-7" />
              </motion.div>

              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-indigo-300 mt-2 leading-relaxed text-xl">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
