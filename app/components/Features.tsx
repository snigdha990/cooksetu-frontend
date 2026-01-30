"use client";

import { motion, Variants } from "framer-motion";
import { ClockIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const features = [
  {
    title: "Verified Cook Network",
    description:
      "User-friendly app connecting users with verified cooks in their vicinity through advanced matching technology.",
    icon: ShieldCheckIcon,
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
  },
  {
    title: "Flexible Booking Options",
    description:
      "One-time, daily, or monthly subscriptions tailored to user needs—complete freedom and convenience.",
    icon: ClockIcon,
    gradient: "from-cyan-400 via-blue-400 to-indigo-500",
  },
  {
    title: "Safety & Quality Assured",
    description:
      "Comprehensive ratings, reviews, and background checks ensure safety and quality assurance for every booking.",
    icon: ShieldCheckIcon,
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
  hover: { scale: 1.05, boxShadow: "0 25px 50px rgba(99,102,241,0.35)" },
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 text-white"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        Why Choose Us
      </motion.h2>

      <motion.div
        className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-stretch flex-wrap"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {features.map(({ title, description, icon: Icon, gradient }) => (
          <motion.div
            key={title}
            className="relative overflow-hidden rounded-3xl p-8 shadow-lg cursor-pointer bg-[#111827]/70 backdrop-blur-md flex-1 min-w-[250px] flex flex-col gap-6 transition-transform duration-300"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 blur-2xl pointer-events-none z-0`}
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 flex items-center justify-start gap-4">
              <div className={`p-4 rounded-lg bg-gradient-to-tr ${gradient} w-max`}>
                <Icon className="h-10 w-10" />
              </div>
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-indigo-300 leading-relaxed">{description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
