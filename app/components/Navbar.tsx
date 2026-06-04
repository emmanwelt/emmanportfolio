"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;

    const targetY = el.getBoundingClientRect().top + window.scrollY;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 1200;
    let startTime: number | null = null;

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/30"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#hero"
          onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
          aria-label="Emmanuel Welt Magpantay - Home"
        />

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleNavClick("#contact")}
              className="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-white border border-white/20 hover:border-white/50 hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)] hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Hire Me
            </button>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } border-t border-white/10`}
        style={{ background: "rgba(10, 10, 15, 0.95)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      >
        <ul className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="w-full text-left px-4 py-3 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li className="pt-2">
            <button
              onClick={() => handleNavClick("#contact")}
              className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 text-white border border-white/20 hover:border-white/50 hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.15)] hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Hire Me
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
