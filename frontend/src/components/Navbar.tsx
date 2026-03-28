"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Servizi", href: "#servizi" },
  { label: "Chi Sono", href: "#chi-sono" },
  { label: "Testimonianze", href: "#testimonianze" },
  { label: "Contatti", href: "#contatti" },
];

// Navbar fissa con trasparenza iniziale e sfondo al scroll
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#1A1A1A]/90 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <span className="text-accent font-heading font-bold text-xl">
              MB
            </span>
            <span className="text-text-primary text-sm hidden sm:inline">
              Mirco Bolognini
            </span>
          </a>

          {/* Link navigazione desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-primary text-sm tracking-wide hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA desktop */}
          <a
            href="#contatti"
            className="hidden md:inline-block border border-accent text-accent px-5 py-2 text-sm tracking-wide hover:bg-accent hover:text-bg-primary transition-all duration-300"
          >
            Contattami
          </a>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Apri menu"
          >
            <span className="w-6 h-[2px] bg-text-primary transition-all" />
            <span className="w-6 h-[2px] bg-text-primary transition-all" />
            <span className="w-4 h-[2px] bg-accent transition-all" />
          </button>
        </div>
      </nav>

      {/* Menu mobile fullscreen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulsante chiudi */}
            <button
              className="absolute top-6 right-6 text-text-primary w-10 h-10 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Chiudi menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-text-primary font-heading text-2xl hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contatti"
                className="border border-accent text-accent px-8 py-3 mt-4 hover:bg-accent hover:text-bg-primary transition-all"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Contattami
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
