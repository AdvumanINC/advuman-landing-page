"use client";

import { motion } from "framer-motion";
import { PlayIcon } from "./icons";

export function PromotionVideo() {
  return (
    <div className="absolute z-30 left-[6%] top-[88px] hidden md:flex items-center gap-4">
      <motion.button
        type="button"
        aria-label="Play promotion video"
        whileHover="hover"
        initial="rest"
        animate="rest"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-line bg-transparent transition-colors duration-300 hover:border-accent"
        variants={{
          rest: { backgroundColor: "rgba(0,0,0,0)" },
          hover: { backgroundColor: "rgba(255,210,0,1)" },
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.span
          className="block"
          variants={{
            rest: { rotate: 0 },
            hover: { rotate: 90 },
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <PlayIcon className="h-4 w-4 text-white translate-x-[1px]" />
        </motion.span>
      </motion.button>
      <div className="leading-tight text-[13px] text-muted">
        <span className="block">See How</span>
        <span className="block">It Works</span>
      </div>
    </div>
  );
}

export function CarouselIndicator({
  current = 1,
  total = 5,
}: {
  current?: number;
  total?: number;
}) {
  const formatted = `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  return (
    <div className="absolute z-30 right-[3%] top-1/2 -translate-y-1/2 hidden md:block">
      <span
        className="inline-block text-[11px] font-medium tracking-[0.3em] text-accent"
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {formatted}
      </span>
    </div>
  );
}

export function CornerTag() {
  return (
    <span className="absolute bottom-3 left-4 z-30 text-[11px] uppercase tracking-[0.3em] text-typo">
      Ru
    </span>
  );
}
