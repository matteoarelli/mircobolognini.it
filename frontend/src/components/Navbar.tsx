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
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-700 ${
          scrolled
            ? "bg-[#1A1A1A]/95 backdrop-blur-lg shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo con bordo contenitore */}
          <a href="#" className="flex items-center gap-3 group focus-visible:outline-none">
            <span className="text-accent font-heading font-bold text-xl tracking-wide transition-all duration-300 group-hover:text-accent-light border border-accent/30 px-2.5 py-0.5 group-hover:border-accent/60">
              MB
            </span>
            <span className="text-text-primary text-sm hidden sm:inline tracking-wide">
              Mirco Bolognini
            </span>
          </a>

          {/* Link navigazione desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-primary text-sm tracking-[0.08em] hover:text-accent transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full focus-visible:outline-none focus-visible:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA desktop — pulsante premium */}
          <a
            href="#contatti"
            className="btn-gold hidden md:inline-block border border-accent text-accent px-6 py-2 text-xs tracking-[0.15em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            Contattami
          </a>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5 -mr-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Apri menu"
          >
            <span className="w-6 h-[1.5px] bg-text-primary transition-all" />
            <span className="w-6 h-[1.5px] bg-text-primary transition-all" />
            <span className="w-4 h-[1.5px] bg-accent transition-all" />
          </button>
        </div>

        {/* Linea dorata sottile sotto la navbar quando scrollata */}
        <div
          className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-opacity duration-700 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </nav>

      {/* Menu mobile fullscreen */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg-primary flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Pulsante chiudi */}
            <button
              className="absolute top-5 right-5 text-text-primary w-12 h-12 flex items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Chiudi menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-text-primary font-heading text-3xl tracking-wide hover:text-accent transition-colors duration-300 py-2 focus-visible:outline-none focus-visible:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contatti"
                className="btn-gold border border-accent text-accent px-10 py-4 mt-4 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
