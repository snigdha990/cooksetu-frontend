"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do users and cooks get started on the platform?",
    answer:
      "Both users and home cooks can sign up by creating a profile. Cooks add details like cuisines, experience, and availability, while users set their preferences to find the right cook.",
  },
  {
    question: "Are the home cooks verified?",
    answer:
      "Yes, all cooks go through an admin verification process to ensure authenticity, hygiene standards, and experience before appearing on the platform.",
  },
  {
    question: "How can I choose the right cook for my needs?",
    answer:
      "You can browse cook profiles, view cuisines offered, experience, pricing, and ratings from other users to select the cook that best matches your requirements.",
  },
  {
    question: "How does the booking process work?",
    answer:
      "Once you select a cook, you can choose your preferred date and time, confirm the booking, and receive a confirmation for the in-home cooking service.",
  },
  {
    question: "What happens after the cook completes the service?",
    answer:
      "After the meal is prepared and served, you can enjoy the food and leave a rating and review to help maintain quality and guide other users.",
  },
  {
    question: "Can I book a cook for special occasions or events?",
    answer:
      "Yes, you can book cooks not only for daily meals but also for family gatherings, parties, and special occasions based on availability.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 text-white"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
      >
        Frequently Asked Questions
      </motion.h2>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {faqs.map(({ question, answer }, i) => {
          const isOpen = openIndex === i;

          return (
            <motion.div
              key={question}
              className="bg-[#111827]/70 rounded-3xl p-6 shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex justify-between items-center text-lg font-medium">
                <h3>{question}</h3>
                <span className="text-indigo-400 text-2xl">
                  {isOpen ? "-" : "+"}
                </span>
              </div>

              {isOpen && (
                <motion.p
                  className="mt-4 text-indigo-300 text-sm leading-relaxed"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  {answer}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
