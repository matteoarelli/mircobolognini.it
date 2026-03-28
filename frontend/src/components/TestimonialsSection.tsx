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
    <section id="testimonianze" className="bg-bg-secondary py-24 px-6">
      <div
        className="max-w-3xl mx-auto text-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Titolo */}
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary mb-2">
            Testimonianze
          </h2>
          <div className="w-10 h-[2px] bg-accent mx-auto mb-16" />
        </ScrollReveal>

        {/* Area citazione */}
        <div className="relative min-h-[200px] flex items-center justify-center">
          {/* Virgolettone decorativo */}
          <span className="absolute -top-4 left-0 md:left-8 text-[120px] leading-none font-heading text-accent opacity-20 select-none pointer-events-none">
            &ldquo;
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              {/* Citazione */}
              <p className="font-heading italic text-xl md:text-2xl text-text-primary leading-relaxed px-4">
                {current.quote}
              </p>

              {/* Autore */}
              <p className="font-body text-text-secondary mt-6">
                — {current.clientName}
              </p>
              <p className="text-text-muted text-sm mt-1">
                {current.jobType}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicatori a pallini */}
        <div className="flex justify-center gap-2 mt-8">
          {visible.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-accent scale-125" : "bg-bg-tertiary"
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
