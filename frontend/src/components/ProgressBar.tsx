"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

// Barra di progresso dorata visibile al caricamento pagina — effetto premium
export default function ProgressBar() {
  const [visible, setVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  if (!visible) return null;

  // Nessuna animazione se l'utente preferisce ridurre il motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[2px] z-50 bg-gradient-to-r from-accent-dark via-accent to-accent-light"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{
        scaleX: [0, 1, 1, 0],
        transformOrigin: ["left", "left", "right", "right"],
      }}
      transition={{
        duration: 1.2,
        times: [0, 0.45, 0.55, 1],
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={() => setVisible(false)}
    />
  );
}
