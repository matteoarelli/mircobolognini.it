"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quickLinks = [
  { label: "Servizi", href: "#servizi" },
  { label: "Chi Sono", href: "#chi-sono" },
  { label: "Testimonianze", href: "#testimonianze" },
  { label: "Contatti", href: "#contatti" },
];

// Footer minimale scuro con pulsante torna su
export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-bg-footer py-16 px-6 relative">
        {/* Separatore superiore dorato */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Colonna 1 — Brand */}
          <div>
            <span className="text-accent font-heading text-2xl font-bold tracking-wide">
              MB
            </span>
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">
              Mirco Bolognini Architetto
            </p>
          </div>

          {/* Colonna 2 — Link rapidi */}
          <div>
            <h3 className="text-text-primary text-xs uppercase tracking-[0.2em] font-medium mb-5">
              Link Rapidi
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-text-muted text-sm hover:text-accent transition-colors duration-300 focus-visible:outline-none focus-visible:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonna 3 — Contatti */}
          <div>
            <h3 className="text-text-primary text-xs uppercase tracking-[0.2em] font-medium mb-5">
              Contatti
            </h3>
            <div className="text-text-muted text-sm space-y-2.5 leading-relaxed">
              <p>Tel: 339 255 6785</p>
              <p>Via Ascoli Piceno, 99</p>
              <p>60126 Ancona AN</p>
              <p className="mt-4">
                Lun-Ven 09-13 / 15-19
                <br />
                Sab 10-12:30
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto border-t border-accent/10 mt-12 pt-8 text-center">
          <p className="text-text-muted text-xs tracking-wide">
            &copy; 2026 Mirco Bolognini Architetto
          </p>
        </div>
      </footer>

      {/* Pulsante torna su */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="btn-gold fixed bottom-6 right-6 w-11 h-11 rounded-full bg-accent text-bg-primary flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.3)] z-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary hover:scale-110"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            aria-label="Torna su"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
