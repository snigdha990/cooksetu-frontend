"use client";

import { motion } from "framer-motion";

export function AnimatedBadge() {
  return (
    <motion.div
      className="
        inline-flex items-center gap-2
        px-5 py-2
        rounded-full
        text-sm md:text-base
        font-semibold
        border border-indigo-400/40
        bg-indigo-900/30
        text-indigo-200
        shadow-[0_0_30px_rgba(99,102,241,0.4)]
      "
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ✨ Connecting homes with trusted cooks
    </motion.div>
  );
}
