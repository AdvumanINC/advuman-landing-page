"use client";

import { useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Props = { progressMV: MotionValue<number> };

type FormState = "idle" | "loading" | "success" | "error";

export function ChampionPanel({ progressMV }: Props) {
  const opacity = useTransform(
    progressMV,
    [0.82, 0.88, 0.97, 1.0],
    [0, 1, 1, 1],
  );
  const titleY = useTransform(progressMV, [0.82, 0.92], [40, 0]);
  const sideOpacity = useTransform(
    progressMV,
    [0.86, 0.92, 1.0],
    [0, 1, 1],
  );

  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || formState === "loading" || formState === "success") return;

    setFormState("loading");
    setErrorMsg("");

    const { error } = await supabase
      .from("waitlist_subscribers")
      .insert([{ email: email.trim().toLowerCase(), source: "landing-page" }]);

    if (error) {
      if (error.code === "23505") {
        setFormState("success");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
        setFormState("error");
      }
    } else {
      setFormState("success");
    }
  }

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-0 z-30"
    >
      {/* Centered title block */}
      <motion.div
        style={{ y: titleY }}
        className="absolute right-[6%] top-[10%] flex flex-col items-end gap-2 max-w-[42%] text-right"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.42em] text-muted">
          Intelligence, Not Noise
        </span>
        <h1
          className="font-display uppercase leading-[0.92] text-white text-right"
          style={{
            fontSize: "clamp(38px, 4.8vw, 78px)",
            letterSpacing: "-0.01em",
          }}
        >
          Know Before
          <br />
          The Cost Lands
        </h1>
      </motion.div>

      {/* Left credential — Free tier */}
      <motion.div
        style={{ opacity: sideOpacity }}
        className="absolute left-[6%] top-[58%] -translate-y-1/2 max-w-[220px]"
      >
        <Credential
          tag="Free"
          title="Corridor Pulse"
          description="Public corridor state · Weekly email pulse · Top public-safe signals · Major alerts — No login required"
        />
      </motion.div>

      {/* Right credential — Basic EWS */}
      <motion.div
        style={{ opacity: sideOpacity }}
        className="absolute right-[6%] top-[58%] -translate-y-1/2 max-w-[240px] text-right"
      >
        <Credential
          tag="£18/mo"
          title="Basic EWS"
          description="Full weekly signal report · Top 5 ranked threats · Archive access · Richer alert emails — Best for regular monitoring"
          align="right"
        />
      </motion.div>

      {/* Waitlist CTA — bottom center */}
      <motion.div
        style={{ opacity: sideOpacity }}
        className="pointer-events-auto absolute bottom-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full max-w-[360px] px-4"
      >
        {formState === "success" ? (
          <div className="w-full rounded-md border border-accent/40 bg-accent/10 px-6 py-4 text-center">
            <p className="text-[13px] font-semibold text-accent">You&apos;re on the list.</p>
            <p className="mt-1 text-[11px] text-muted">First brief arrives Monday.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-md border border-line bg-white/5 px-4 py-3 text-[13px] text-white placeholder:text-muted focus:border-accent focus:outline-none transition-colors duration-200"
            />
            {errorMsg && (
              <p className="text-[11px] text-red-400 text-center">{errorMsg}</p>
            )}
            <motion.button
              type="submit"
              disabled={formState === "loading"}
              whileHover={{ scale: formState === "loading" ? 1 : 1.04, backgroundColor: "#e6bd00" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="w-full rounded-md bg-accent px-8 py-4 font-display text-[15px] uppercase tracking-[0.18em] text-obsidian shadow-glow transition-shadow duration-300 hover:shadow-glow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formState === "loading" ? "Joining..." : "Get the Weekly Pulse"}
            </motion.button>
          </form>
        )}
        <span className="text-[10px] text-muted tracking-wide">
          First brief arrives Monday · No credit card · Unsubscribe anytime
        </span>
      </motion.div>
    </motion.div>
  );
}

function Credential({
  tag,
  title,
  description,
  align = "left",
}: {
  tag: string;
  title: string;
  description: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`flex flex-col gap-3 ${align === "right" ? "items-end" : "items-start"}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-accent">
        {tag}
      </span>
      <h3 className="text-[24px] font-bold leading-tight text-white">{title}</h3>
      <div
        className={`h-px w-12 bg-white/30 ${align === "right" ? "self-end" : "self-start"}`}
      />
      <p className="text-[13px] leading-relaxed text-muted">{description}</p>
    </div>
  );
}
