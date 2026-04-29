"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PhoneIcon } from "./icons";
import { CALENDLY_URL } from "@/lib/config";

// Scroll progress thresholds for each section (container is 500vh, scrollable = 400vh)
const NAV_LINKS = [
  { label: "How It Works", progress: 0.52 },
  { label: "Proof",        progress: 0.72 },
  { label: "Pricing",      progress: 0.92 },
];

function scrollToProgress(p: number) {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: p * scrollable, behavior: "smooth" });
}

function useCalendly() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("calendly-css")) {
      setReady(true);
      return;
    }

    const link = document.createElement("link");
    link.id = "calendly-css";
    link.rel = "stylesheet";
    link.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  function openPopup() {
    if (ready && typeof (window as any).Calendly !== "undefined") {
      (window as any).Calendly.initPopupWidget({ url: CALENDLY_URL });
    }
  }

  return { openPopup };
}

export function Navbar() {
  const [active, setActive] = useState("How It Works");
  const { openPopup } = useCalendly();

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 md:py-8"
      aria-label="Primary"
    >
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex items-center text-white"
        aria-label="Advuman home"
      >
        <span
          className="font-display uppercase leading-none tracking-tight text-[22px]"
          style={{ letterSpacing: "-0.03em" }}
        >
          ADVUMAN
        </span>
      </button>

      <ul className="hidden md:flex items-center gap-12 text-[15px] font-medium">
        {NAV_LINKS.map(({ label, progress }) => {
          const isActive = active === label;
          return (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  setActive(label);
                  scrollToProgress(progress);
                }}
                className={`nav-link transition-colors duration-200 ${
                  isActive ? "is-active text-accent" : "text-white/85 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center text-white">
        <button
          type="button"
          aria-label="Book a call"
          onClick={openPopup}
          className="transition-transform duration-200 ease-out hover:scale-110"
        >
          <PhoneIcon className="h-7 w-7" />
        </button>
      </div>
    </motion.nav>
  );
}
