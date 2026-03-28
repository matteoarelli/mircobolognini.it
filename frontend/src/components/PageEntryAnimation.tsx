"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

// Animazione di ingresso pagina — fade-in dal basso dopo il progress bar
export default function PageEntryAnimation({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
