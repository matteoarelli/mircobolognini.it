"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Barra di progresso dorata visibile al caricamento pagina
export default function ProgressBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-[3px] z-50 bg-accent"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{
        scaleX: [0, 1, 1, 0],
        transformOrigin: ["left", "left", "right", "right"],
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.5, 0.5, 1],
        ease: "easeInOut",
      }}
      onAnimationComplete={() => setVisible(false)}
    />
  );
}
