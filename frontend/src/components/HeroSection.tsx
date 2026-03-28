"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
  content: {
    subtitle: string;
    tagline: string;
    cta: string;
  };
}

const doorEase: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

// Sezione hero a schermo intero con animazione "porte che si aprono"
export default function HeroSection({ content }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const skipAnimation = !!prefersReducedMotion;

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col-reverse md:flex-row">
      {/* Metà sinistra — testo */}
      <motion.div
        className="flex-1 md:w-1/2 flex items-center bg-bg-primary relative z-10"
        initial={skipAnimation ? {} : { x: "50%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: doorEase }}
      >
        <div className="px-8 md:px-16 lg:px-24 py-16 md:py-0 w-full">
          {/* Sottotitolo */}
          <motion.p
            className="text-accent uppercase tracking-[3px] text-xs font-body mb-6"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.0, duration: 0.6 }}
          >
            {content.subtitle}
          </motion.p>

          {/* Nome */}
          <motion.h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-6"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.1, duration: 0.6 }}
          >
            Mirco
            <br />
            Bolognini
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-text-secondary text-lg max-w-md mb-6"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.2, duration: 0.6 }}
          >
            {content.tagline}
          </motion.p>

          {/* Linea divisoria dorata */}
          <motion.div
            className="w-10 h-[2px] bg-accent my-6"
            initial={skipAnimation ? {} : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: skipAnimation ? 0 : 1.3, duration: 0.6 }}
          />

          {/* CTA */}
          <motion.a
            href="#servizi"
            className="inline-block border border-accent text-accent px-8 py-3 tracking-wide hover:bg-accent hover:text-bg-primary transition-all duration-300"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.4, duration: 0.6 }}
          >
            {content.cta}
          </motion.a>
        </div>
      </motion.div>

      {/* Metà destra — immagine */}
      <motion.div
        className="h-[40vh] md:h-full md:w-1/2 relative"
        initial={skipAnimation ? {} : { x: "-50%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.2, ease: doorEase }}
      >
        <img
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
          alt="Architettura moderna"
          className="w-full h-full object-cover"
        />
        {/* Overlay sfumato per transizione morbida */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/40 to-transparent md:block hidden" />
      </motion.div>
    </section>
  );
}
