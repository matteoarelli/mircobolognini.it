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
    <section id="servizi" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Titolo sezione */}
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl text-text-primary mb-2">
            Servizi
          </h2>
          <div className="w-10 h-[2px] bg-accent mb-16" />
        </ScrollReveal>

        {/* Lista servizi */}
        <div>
          {services
            .filter((s) => s.active)
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.1}>
                <div className="border-b border-[#333]">
                  {/* Riga cliccabile */}
                  <button
                    className="w-full flex items-center gap-6 py-6 text-left group"
                    onClick={() => toggleService(service.id)}
                    aria-expanded={expandedId === service.id}
                  >
                    {/* Numero */}
                    <span className="font-heading text-xl text-accent min-w-[2.5rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Titolo */}
                    <span className="flex-1 text-text-primary tracking-wide text-lg group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </span>
                    {/* Freccia */}
                    <motion.span
                      className="text-accent text-xl"
                      animate={{
                        rotate: expandedId === service.id ? 90 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      →
                    </motion.span>
                  </button>

                  {/* Contenuto espanso */}
                  <AnimatePresence>
                    {expandedId === service.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pl-[calc(2.5rem+1.5rem)]">
                          <p className="text-text-secondary leading-relaxed mb-4">
                            {service.shortDescription}
                          </p>
                          <a
                            href={`/servizi/${service.slug}`}
                            className="text-accent text-sm tracking-wide hover:underline"
                          >
                            Approfondisci →
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
