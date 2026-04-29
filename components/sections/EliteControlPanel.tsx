"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type Props = { progressMV: MotionValue<number> };

export function EliteControlPanel({ progressMV }: Props) {
  const opacity = useTransform(
    progressMV,
    [0.22, 0.28, 0.36, 0.4],
    [0, 1, 1, 0],
  );
  const x = useTransform(progressMV, [0.22, 0.32], [-40, 0]);

  return (
    <motion.div
      aria-hidden={undefined}
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30 flex items-center"
    >
      <motion.div
        style={{ x }}
        className="ml-[6%] max-w-[34%] flex flex-col gap-10"
      >
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-accent">
          </span>
        </div>

        <h2
          className="font-display uppercase leading-[0.88] text-white"
          style={{ fontSize: "clamp(26px, 3.2vw, 52px)" }}
        >
          The Cost of
          <br />
          Not Knowing
        </h2>

        <div className="flex flex-col gap-8 max-w-[420px]">
          <Stat
            value="£25K"
            label="Single duty cost a timely alert could help avoid"
            description="A single customs ruling or duty reclassification on a mid-size shipment can trigger five-figure exposure. Early signals mean time to adapt."
          />
          <Stat
            value="15–20"
            valueSuffix="days"
            label="Transit extension when key routes reroute under disruption"
            description="Port congestion and carrier pivots add weeks of transit time, compounding landed cost and delivery commitments."
          />
          <Stat
            value="24+"
            label="Sources monitored per corridor — regulatory, shipping, cost pressure"
            description="We aggregate regulatory notices, port bulletins, carrier updates, and freight indices into one weekly read."
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Stat({
  value,
  valueSuffix,
  label,
  description,
}: {
  value: string;
  valueSuffix?: string;
  label: string;
  description: string;
}) {
  return (
    <div className="border-l border-white/15 pl-5">
      <div className="flex items-baseline gap-1">
        <span
          className="font-display text-white leading-none"
          style={{ fontSize: "44px" }}
        >
          {value}
        </span>
        {valueSuffix && (
          <span className="text-[15px] font-medium text-muted">{valueSuffix}</span>
        )}
      </div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
        {label}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}
