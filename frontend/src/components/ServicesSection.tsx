"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/types";
import ScrollReveal from "./ScrollReveal";

interface ServicesSectionProps {
  services: Service[];
}

// Sezione servizi con lista numerata espandibile (accordion)
export default function ServicesSection({ services }: ServicesSectionProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleService = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="servizi" className="py-32 md:py-40 px-6 relative">
      {/* Separatore superiore sottile */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="max-w-4xl mx-auto">
        {/* Titolo sezione */}
        <ScrollReveal>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] text-text-primary leading-[1.1] tracking-[-0.01em] mb-3">
            Servizi
          </h2>
          <div className="w-12 h-[1px] bg-accent mb-20" />
        </ScrollReveal>

        {/* Lista servizi */}
        <div>
          {services
            .filter((s) => s.active)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.08}>
                <div className="border-b border-[#2a2a2a]">
                  {/* Riga cliccabile */}
                  <button
                    className="w-full flex items-center gap-6 py-7 text-left group"
                    onClick={() => toggleService(service.id)}
                    aria-expanded={expandedId === service.id}
                  >
                    {/* Numero */}
                    <span className="font-heading text-lg text-accent/70 min-w-[2.5rem] transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Titolo */}
                    <span className="flex-1 text-text-primary tracking-wide text-lg font-body group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </span>
                    {/* Freccia con rotazione fluida */}
                    <motion.span
                      className="text-accent/60 text-lg group-hover:text-accent transition-colors duration-300"
                      animate={{
                        rotate: expandedId === service.id ? 90 : 0,
                      }}
                      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      &rarr;
                    </motion.span>
                  </button>

                  {/* Contenuto espanso */}
                  <AnimatePresence>
                    {expandedId === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                          opacity: { duration: 0.3, delay: 0.1 },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-[calc(2.5rem+1.5rem)]">
                          <p className="text-text-secondary leading-[1.8] text-[15px] mb-5">
                            {service.shortDescription}
                          </p>
                          <a
                            href={`/servizi/${service.slug}`}
                            className="text-accent text-sm tracking-[0.1em] uppercase hover:underline underline-offset-4 transition-all duration-300"
                          >
                            Approfondisci &rarr;
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
}
