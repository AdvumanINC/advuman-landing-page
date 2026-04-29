"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = { progressMV: MotionValue<number> };

export function PerfectFlightPanel({ progressMV }: Props) {
  const opacity = useTransform(
    progressMV,
    [0.42, 0.48, 0.56, 0.6],
    [0, 1, 1, 0],
  );
  const x = useTransform(progressMV, [0.42, 0.52], [40, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-end"
    >
      <motion.div
        style={{ x }}
        className="mr-[6%] max-w-[40%] flex flex-col items-end gap-8 text-right"
      >
        <span className="rounded-full border border-white/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-white">
          How It Works
        </span>

        <h2
          className="font-display uppercase leading-[0.88] text-white"
          style={{ fontSize: "clamp(36px, 4.8vw, 76px)" }}
        >
          Three
          <br />
          Layers.
          <br />
          One Read.
        </h2>

        <div className="flex flex-col gap-5 w-full max-w-[360px]">
          <Step
            number="01"
            title="Monitor the Corridor"
            body="We track regulatory notices, port updates, and carrier changes across the UK–India trade lane."
          />
          <Step
            number="02"
            title="Read What Matters"
            body="Signals grouped into compliance, shipping, and landed cost pressure."
          />
          <Step
            number="03"
            title="Get the Weekly Pulse"
            body="Start free. Upgrade for the full report, ranked threats, and plain-English briefs every Monday."
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Step({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex items-start justify-end gap-4 text-right">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
          {title}
        </div>
        <p className="text-[12px] leading-relaxed text-muted">{body}</p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15">
        <span
          className="font-display text-white leading-none"
          style={{ fontSize: "13px" }}
        >
          {number}
        </span>
      </div>
    </div>
  );
}
