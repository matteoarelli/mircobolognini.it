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
    <section id="servizi" className="py-24 sm:py-32 md:py-40 px-6 relative overflow-hidden">
      {/* Separatore superiore sottile */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60px] h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Numero decorativo grande sullo sfondo */}
      <div className="absolute top-16 right-0 md:right-12 text-[clamp(8rem,20vw,16rem)] font-heading font-bold text-text-primary/[0.02] leading-none select-none pointer-events-none tracking-tight">
        01—06
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
                <div className="border-b border-[#2a2a2a] relative group/row">
                  {/* Linea dorata decorativa sul lato sinistro */}
                  <div className="absolute left-0 top-0 w-[2px] h-full bg-accent/0 group-hover/row:bg-accent/40 transition-all duration-500" />

                  {/* Glow dorato sottile al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Riga cliccabile */}
                  <button
                    className="w-full flex items-center gap-4 sm:gap-6 py-6 sm:py-7 pl-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded relative z-10"
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
                        <div className="pb-7 pl-4 sm:pl-[calc(2.5rem+1.5rem+1rem)]">
                          <p className="text-text-secondary leading-[1.8] text-[15px] mb-5">
                            {service.shortDescription}
                          </p>
                          {/* Tag sotto-servizi se disponibili */}
                          {service.subServices && service.subServices.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {service.subServices.map((sub, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs text-accent/80 border border-accent/20 px-3 py-1 tracking-wide"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          )}
                          <a
                            href={`/servizi/${service.slug}`}
                            className="inline-block text-accent text-sm tracking-[0.1em] uppercase hover:underline underline-offset-4 transition-all duration-300 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
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
