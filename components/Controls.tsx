"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

type ControlsProps = {
  onPrev?: () => void;
  onNext?: () => void;
  onAddToCart?: () => void;
};

export function Controls({ onPrev, onNext, onAddToCart }: ControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 flex items-end justify-between gap-6 px-6 pb-8 pt-6 md:px-12 md:pb-10 md:pt-8">
      {/* Price + Info */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col"
      >
        <span
          className="font-display text-accent leading-none"
          style={{ fontSize: "clamp(48px, 6vw, 96px)", fontWeight: 400 }}
        >
          $34.99
        </span>
        <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          SIZE: <span className="text-white">29.5&quot;</span>
          <span className="mx-2 text-white/60">•</span>
          OFFICIAL
        </span>
      </motion.div>

      {/* CTA */}
      <motion.button
        type="button"
        onClick={onAddToCart}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05, backgroundColor: "#ff6a1f" }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="inline-flex items-center justify-center rounded-md bg-accent px-8 md:px-16 py-4 md:py-5 font-display text-[14px] md:text-[18px] uppercase tracking-[0.18em] text-white shadow-glow transition-shadow duration-300 hover:shadow-glow-lg"
      >
        Add to Cart
      </motion.button>

      {/* Arrows */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3"
      >
        <ArrowButton direction="left" onClick={onPrev} />
        <ArrowButton direction="right" onClick={onNext} />
      </motion.div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick?: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeftIcon : ChevronRightIcon;
  const xOffset = direction === "left" ? -2 : 2;
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous" : "Next"}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-line bg-transparent text-white transition-colors duration-200 hover:border-accent"
    >
      <motion.span
        variants={{
          rest: { x: 0 },
          hover: { x: xOffset },
        }}
        transition={{ type: "spring", stiffness: 380, damping: 24 }}
        className="block"
      >
        <Icon className="h-5 w-5" />
      </motion.span>
    </motion.button>
  );
}
