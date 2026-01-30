"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import HowItWorks from "./components/Howitworks";
import BusinessModel from "./components/BusinessModel";
import FAQ from "./components/FAQ";
import AboutUs from "./components/AboutUs";
import Footer from "./components/Footer";

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-[#F5FAFF] dark:bg-[#011426] transition-colors">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <HeroSection />
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <Features />
      </section>
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <HowItWorks />
      </section>
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <BusinessModel />
      </section>
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <FAQ />
      </section>
      <section className="max-w-7xl mx-auto px-6 pt-4">
        <AboutUs />
      </section>
        <Footer />
    </main>
  );
}
