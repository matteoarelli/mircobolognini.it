"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  content: {
    subtitle: string;
    tagline: string;
    cta: string;
  };
}

const doorEase: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

export default function HeroSection({ content }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const skip = !!prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Immagine di sfondo — occupa TUTTA la hero, con parallax */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        initial={skip ? {} : { scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: doorEase }}
        style={skip ? {} : { y: imageY }}
      >
        <img
          src="https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080"
          alt="Architettura moderna"
          className="w-full h-full object-cover scale-110"
          loading="eager"
        />
      </motion.div>

      {/* Overlay scuro su tutta l'immagine */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Gradient più forte a sinistra per leggibilità testo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      {/* Gradient dal basso per profondità */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

      {/* Pattern griglia architetturale sottile */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,169,110,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Contenuto testo — posizionato a sinistra */}
      <div className="relative z-10 h-full flex items-center">
        <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 w-full max-w-3xl">
          {/* Sottotitolo */}
          <motion.p
            className="text-accent uppercase text-[11px] md:text-xs font-body font-medium mb-6 md:mb-8"
            initial={skip ? {} : { opacity: 0, y: 20, letterSpacing: "0.15em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
            transition={{ delay: skip ? 0 : 0.8, duration: 0.9, ease: "easeOut" }}
          >
            {content.subtitle}
          </motion.p>

          {/* Nome */}
          <motion.h1
            className="font-heading text-text-primary leading-[1.05] mb-6 md:mb-8"
            initial={skip ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skip ? 0 : 1.0, duration: 0.8, ease: "easeOut" }}
          >
            <span className="block text-[clamp(1.8rem,4vw,3rem)] font-light tracking-[0.05em]">
              Mirco
            </span>
            <span className="block text-[clamp(3rem,8vw,6rem)] font-bold tracking-[-0.03em]">
              Bolognini
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-text-primary/70 text-base md:text-lg max-w-md leading-relaxed mb-6 md:mb-8"
            initial={skip ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skip ? 0 : 1.2, duration: 0.7, ease: "easeOut" }}
          >
            {content.tagline}
          </motion.p>

          {/* Linea dorata */}
          <motion.div
            className="w-12 h-[1px] bg-accent mb-8"
            initial={skip ? {} : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: skip ? 0 : 1.3, duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />

          {/* CTA */}
          <motion.a
            href="#servizi"
            className="btn-gold inline-block w-full sm:w-auto text-center border border-accent text-accent px-8 sm:px-10 py-4 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            initial={skip ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skip ? 0 : 1.4, duration: 0.7, ease: "easeOut" }}
          >
            {content.cta}
          </motion.a>
        </div>
      </div>

      {/* Linea dorata in fondo */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent z-20"
        initial={skip ? {} : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: skip ? 0 : 1.6, duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={skip ? {} : { opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: skip ? 0 : 2.0, duration: 0.8 }}
      >
        <span className="text-text-primary/50 text-[10px] uppercase tracking-[0.3em] font-body">
          Scroll
        </span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent/60"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
