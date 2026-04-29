"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { PromotionVideo } from "../Overlay";

type Props = { progressMV: MotionValue<number> };

export function HeroPanel({ progressMV }: Props) {
  const opacity = useTransform(progressMV, [0, 0.05, 0.13, 0.2], [1, 1, 1, 0]);
  const y = useTransform(progressMV, [0, 0.2], [0, -30]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 z-30"
    >
      <div className="pointer-events-auto">
        <PromotionVideo />

        {/* Hero content — bottom-left */}
        <div className="absolute bottom-[10%] left-[6%] flex flex-col gap-4 max-w-[480px]">
          <motion.h2
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display uppercase leading-[0.9] text-white"
            style={{ fontSize: "clamp(28px, 3.5vw, 52px)", letterSpacing: "-0.02em" }}
          >
            Know before it hits
            <br />
            your bottom line.
          </motion.h2>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13px] leading-relaxed text-muted max-w-[360px]"
          >
            Weekly trade risk intelligence for UK companies on the UK–India corridor.
            Human-reviewed. No jargon. Free to start.
          </motion.p>

          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2 mt-1"
          >
            <StatusBadge label="UK–INDIA" status="ACTIVE" active />
            <StatusBadge label="UK–EGYPT" status="COMING SOON" active={false} />
            <StatusBadge label="UPDATED 09 APR 2026" status={null} timestamp />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({
  label,
  status,
  active = false,
  timestamp = false,
}: {
  label: string;
  status: string | null;
  active?: boolean;
  timestamp?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
        timestamp
          ? "border-white/15 text-white/40"
          : active
          ? "border-accent/40 text-accent"
          : "border-white/20 text-white/55"
      }`}
    >
      {!timestamp && (
        <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-accent" : "bg-white/40"}`} />
      )}
      {label}
      {status && <span className="text-white/30 mx-0.5">·</span>}
      {status && <span>{status}</span>}
    </span>
  );
}
