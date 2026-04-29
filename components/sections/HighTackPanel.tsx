"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = { progressMV: MotionValue<number> };

export function HighTackPanel({ progressMV }: Props) {
  const opacity = useTransform(
    progressMV,
    [0.62, 0.68, 0.76, 0.8],
    [0, 1, 1, 0],
  );

  // Rings scale up subtly as the user enters the section
  const ringScale = useTransform(progressMV, [0.62, 0.72], [0.85, 1]);

  return (
    <>
      {/* Concentric rings behind the basketball (z-10) */}
      <motion.div
        style={{ opacity, scale: ringScale }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <TrackingRings />
      </motion.div>

      {/* Text labels above the basketball (z-30) */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-0 z-30"
      >
        <div className="absolute left-[14%] top-[30%] flex flex-col gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
            Case Study
          </div>
          <div className="flex items-center gap-3 border-l-2 border-white/40 pl-3">
            <span
              className="font-display leading-none text-white"
              style={{ fontSize: "44px" }}
            >
              25 Feb
            </span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Hormuz Signal Flagged
          </div>
        </div>

        <div className="absolute right-[10%] bottom-[28%] flex flex-col items-end gap-2">
          <h3
            className="font-display leading-none text-white"
            style={{ fontSize: "44px" }}
          >
            UK–INDIA
          </h3>
          <div className="border-r-2 border-white/40 pr-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted">
            Feb–Mar 2026
          </div>
        </div>

        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">
          Corridor: Watch
        </div>
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">
          Risk Escalated
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-[16%] text-[10px] font-mono uppercase tracking-[0.32em] text-white/70">
          Before Mainstream Press
        </div>
      </motion.div>
    </>
  );
}

function TrackingRings() {
  return (
    <svg
      viewBox="-200 -200 400 400"
      className="opacity-90"
      style={{ width: "86vmin", height: "86vmin" }}
      aria-hidden="true"
    >
      <circle
        cx="0"
        cy="0"
        r="180"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
        strokeDasharray="4 8"
      />
      <circle
        cx="0"
        cy="0"
        r="135"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="3 6"
      />
      <circle
        cx="0"
        cy="0"
        r="98"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
      />

      <line
        x1="-200"
        y1="0"
        x2="200"
        y2="0"
        stroke="rgba(255,255,255,0.08)"
        strokeDasharray="2 6"
      />
      <line
        x1="0"
        y1="-200"
        x2="0"
        y2="200"
        stroke="rgba(255,255,255,0.08)"
        strokeDasharray="2 6"
      />

      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <line x1="0" y1="-188" x2="0" y2="-172" stroke="#FFD200" strokeWidth="2.5" />
        </g>
      ))}

      {[45, 135, 225, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <line x1="0" y1="-186" x2="0" y2="-176" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}
