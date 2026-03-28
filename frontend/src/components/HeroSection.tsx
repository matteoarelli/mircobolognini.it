"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeroSectionProps {
  content: {
    subtitle: string;
    tagline: string;
    cta: string;
  };
}

// Easing cinematografico per l'apertura "porte"
const doorEase: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

// Sezione hero a schermo intero con animazione "porte che si aprono"
export default function HeroSection({ content }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const skipAnimation = !!prefersReducedMotion;

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col-reverse md:flex-row">
      {/* Meta sinistra — testo */}
      <motion.div
        className="flex-1 md:w-1/2 flex items-center bg-bg-primary relative z-10"
        initial={skipAnimation ? {} : { x: "50%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.4, ease: doorEase }}
      >
        {/* Pattern griglia architetturale dietro il testo */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="px-6 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-12 sm:py-16 md:py-0 w-full relative z-10">
          {/* Sottotitolo */}
          <motion.p
            className="text-accent uppercase tracking-[0.25em] text-[11px] md:text-xs font-body font-medium mb-8"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.2, duration: 0.7, ease: "easeOut" }}
          >
            {content.subtitle}
          </motion.p>

          {/* Nome — gerarchia visiva: MIRCO piu leggero, BOLOGNINI piu pesante */}
          <motion.h1
            className="font-heading text-text-primary leading-[1.05] tracking-[-0.02em] mb-8"
            initial={skipAnimation ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.3, duration: 0.8, ease: "easeOut" }}
          >
            <span className="block text-[clamp(2rem,5vw,3.5rem)] font-light tracking-[0.05em]">
              Mirco
            </span>
            <span className="block text-[clamp(3.5rem,9vw,6.5rem)] font-bold tracking-[-0.03em]">
              Bolognini
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-text-secondary text-base md:text-lg max-w-md leading-relaxed mb-8"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.45, duration: 0.7, ease: "easeOut" }}
          >
            {content.tagline}
          </motion.p>

          {/* Linea divisoria dorata */}
          <motion.div
            className="w-12 h-[1px] bg-accent my-8"
            initial={skipAnimation ? {} : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: skipAnimation ? 0 : 1.55, duration: 0.7, ease: "easeOut" }}
            style={{ transformOrigin: "left" }}
          />

          {/* CTA — pulsante premium */}
          <motion.a
            href="#servizi"
            className="btn-gold inline-block border border-accent text-accent px-8 sm:px-10 py-3.5 sm:py-4 text-sm tracking-[0.15em] uppercase hover:bg-accent hover:text-bg-primary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            initial={skipAnimation ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skipAnimation ? 0 : 1.65, duration: 0.7, ease: "easeOut" }}
          >
            {content.cta}
          </motion.a>
        </div>
      </motion.div>

      {/* Meta destra — immagine */}
      <motion.div
        className="h-[35vh] sm:h-[40vh] md:h-full md:w-1/2 relative"
        initial={skipAnimation ? {} : { x: "-50%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1.4, ease: doorEase }}
      >
        <img
          src="https://images.pexels.com/photos/2119713/pexels-photo-2119713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
          alt="Architettura moderna"
          className="w-full h-full object-cover"
        />
        {/* Overlay sfumato radiale + lineare per profondita */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/80 via-bg-primary/40 to-transparent md:block hidden" />
        <div className="absolute inset-0 md:block hidden" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(26,26,26,0.6) 0%, transparent 70%)" }} />
        {/* Overlay scuro leggero su tutta l'immagine per coesione */}
        <div className="absolute inset-0 bg-black/25" />
        {/* Overlay sfumato dal basso per mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent md:hidden" />
      </motion.div>

      {/* Linea dorata orizzontale animata in fondo all'hero */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent z-20"
        initial={skipAnimation ? {} : { scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: skipAnimation ? 0 : 1.8, duration: 1.2, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      {/* Indicatore scroll animato */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={skipAnimation ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: skipAnimation ? 0 : 2.2, duration: 0.8 }}
      >
        <span className="text-text-secondary text-[10px] uppercase tracking-[0.3em] font-body">Scroll</span>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-accent"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </motion.div>
    </section>
  );
}
