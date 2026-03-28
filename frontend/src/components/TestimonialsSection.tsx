"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Testimonial } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

// Componente stelle dorate
function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-6">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-accent"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
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
    <section id="testimonianze" className="bg-bg-secondary py-28 sm:py-36 md:py-44 px-6 relative overflow-hidden">
      {/* Separatore superiore */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Cerchio/arco dorato decorativo — nascosti su mobile per evitare clutter */}
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-accent/[0.04] pointer-events-none" />
      <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-accent/[0.06] pointer-events-none" />

      <div
        className="max-w-3xl mx-auto text-center relative z-10"
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
        <div className="relative min-h-[260px] flex items-center justify-center">
          {/* Virgolettone decorativo — piu grande e visibile */}
          <span className="absolute -top-4 left-0 md:left-4 text-[120px] sm:text-[180px] leading-none font-heading text-accent/[0.12] select-none pointer-events-none">
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
              {/* Stelle dorate */}
              <StarRating count={5} />

              {/* Citazione — leggermente piu piccola su mobile */}
              <p className="font-heading italic text-[clamp(1.05rem,2.5vw,1.65rem)] text-text-primary leading-[1.6] px-2 sm:px-4">
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
        <div className="flex justify-center gap-2 mt-12">
          {visible.map((_, i) => (
            <button
              key={i}
              className="relative p-3 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none group"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Vai alla testimonianza ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-500 ease-out ${
                  i === currentIndex
                    ? "bg-accent w-6 h-1.5"
                    : "bg-bg-tertiary w-1.5 h-1.5 group-hover:bg-accent/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
