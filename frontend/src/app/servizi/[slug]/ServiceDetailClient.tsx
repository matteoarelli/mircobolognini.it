"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Animazione reveal per il contenuto principale
export function ServiceReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Animazione reveal per il breadcrumb
export function BreadcrumbReveal({ children }: { children: ReactNode }) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-8"
    >
      {children}
    </motion.nav>
  );
}

// Numero decorativo grande in sfondo
export function ServiceNumber({ number }: { number: string }) {
  return (
    <motion.span
      className="absolute -top-8 right-0 text-[120px] md:text-[200px] font-heading text-accent/10 select-none pointer-events-none leading-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      {number}
    </motion.span>
  );
}
