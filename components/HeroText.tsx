"use client";

import { motion } from "framer-motion";

type HeroTextProps = {
  text?: string;
};

export function HeroText({ text = "SPACING" }: HeroTextProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <motion.h1
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-display select-none text-center uppercase tracking-tightest"
        style={{
          fontSize: "25vw",
          lineHeight: 0.85,
          color: "#4A4A4A",
          letterSpacing: "-0.05em",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </motion.h1>
    </div>
  );
}
