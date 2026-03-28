"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Sezione testimonianze con crossfade automatico e indicatori
export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const visible = testimonials.filter((t) => t.visible);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % visible.length);
  }, [visible.length]);

  // Auto-avanzamento ogni 6 secondi, pausa su hover
  useEffect(() => {
    if (paused || visible.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [paused, next, visible.length]);

  if (visible.length === 0) return null;

  const current = visible[currentIndex];

  return (
    <section id="testimonianze" className="bg-bg-secondary py-32 md:py-40 px-6 relative">
      {/* Separatore superiore */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div
        className="max-w-3xl mx-auto text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Titolo */}
        <ScrollReveal>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-text-primary leading-[1.1] tracking-[-0.01em] mb-3">
            Testimonianze
          </h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mb-20" />
        </ScrollReveal>

        {/* Area citazione */}
        <div className="relative min-h-[220px] flex items-center justify-center">
          {/* Virgolettone decorativo */}
          <span className="absolute -top-6 left-0 md:left-8 text-[140px] leading-none font-heading text-accent/[0.08] select-none pointer-events-none">
            &ldquo;
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10"
            >
              {/* Citazione */}
              <p className="font-heading italic text-[clamp(1.15rem,2.5vw,1.65rem)] text-text-primary leading-[1.6] px-4">
                {current.quote}
              </p>

              {/* Separatore sottile */}
              <div className="w-8 h-[1px] bg-accent/40 mx-auto mt-8 mb-6" />

              {/* Autore */}
              <p className="font-body text-text-secondary text-sm tracking-wide uppercase">
                {current.clientName}
              </p>
              <p className="text-text-muted text-xs mt-1.5 tracking-wide">
                {current.jobType}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicatori a pallini */}
        <div className="flex justify-center gap-3 mt-10">
          {visible.map((_, i) => (
            <button
              key={i}
              className={`rounded-full transition-all duration-500 ease-out ${
                i === currentIndex
                  ? "bg-accent w-6 h-1.5"
                  : "bg-bg-tertiary w-1.5 h-1.5 hover:bg-accent/40"
              }`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Vai alla testimonianza ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
