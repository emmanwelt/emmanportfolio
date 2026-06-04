"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 100); // Adjust speed here (lower = faster)

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </>
  );
}

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (!el) return;

    const targetY = el.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1200; // ms — adjust for slower/faster
    let startTime: number | null = null;

    // Ease-in-out cubic
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-yellow-400/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-500/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-60 h-60 md:w-80 md:h-80 rounded-full bg-yellow-300/15 blur-3xl animate-blob animation-delay-4000" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Two-column layout: photo left, text right */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Left — Profile photo */}
          <div className="fade-in-up flex-shrink-0 mt-8 md:mt-0">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full ring-2 ring-white/20 overflow-hidden shadow-[0_0_40px_8px_rgba(255,255,255,0.08)]">
              <Image
                src="/iman.jpg"
                alt="Emmanuel Welt Magpantay"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>

          {/* Right — Text content */}
          <div className="flex-1 text-center md:text-left">
            {/* Main heading */}
            <h1 className="fade-in-up-delay-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-gray-400 to-gray-700 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]">
                <TypingEffect text="Hi, I'm Emmanuel Welt Magpantay" />
              </span>
            </h1>

            {/* Tagline */}
            <p className="fade-in-up-delay-2 text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mb-4 leading-relaxed">
              A passionate{" "}
              <span className="text-white font-medium">Full-Stack Developer</span>{" "}
              crafting modern, performant web experiences that users love.
            </p>
            <p className="fade-in-up-delay-3 text-base text-white/40 max-w-xl mb-10">
              I build clean, scalable applications — from pixel-perfect UIs to robust backend systems.
            </p>

            {/* CTA Buttons */}
            <div className="fade-in-up-delay-4 flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
              <button
                onClick={() => handleScroll("#projects")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-white border border-white/20 hover:border-white/50 hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)] hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                View My Work
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-base glass text-white/80 hover:text-white hover:scale-105 transition-all duration-200 cursor-pointer border border-white/20 hover:border-white/50 hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)] hover:bg-white/5"
              >
                Contact Me
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
