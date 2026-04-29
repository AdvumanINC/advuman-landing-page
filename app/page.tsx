"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroText } from "@/components/HeroText";
import { CornerTag } from "@/components/Overlay";
import { SceneClient } from "@/components/SceneClient";
import { HeroPanel } from "@/components/sections/HeroPanel";
import { EliteControlPanel } from "@/components/sections/EliteControlPanel";
import { PerfectFlightPanel } from "@/components/sections/PerfectFlightPanel";
import { HighTackPanel } from "@/components/sections/HighTackPanel";
import { ChampionPanel } from "@/components/sections/ChampionPanel";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroTextOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.13, 0.2],
    [1, 1, 1, 0],
  );

  return (
    <main className="bg-accent">
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 h-screen w-screen p-3 md:p-4 bg-accent">
          <div className="app-bg relative h-full w-full overflow-hidden rounded-lg">
            <Navbar />
            <CornerTag />

            {/* "SIGNALS" background word — z-10, rendered before the canvas so
                the globe (z-20) correctly overlaps it */}
            <motion.div
              style={{ opacity: heroTextOpacity }}
              className="pointer-events-none absolute inset-0 z-10"
            >
              <HeroText text="SIGNALS" />
            </motion.div>

            {/* 3D globe — z-20 */}
            <SceneClient progressMV={scrollYProgress} />

            {/* Section overlays — z-30, each fades in around its scroll range */}
            <HeroPanel progressMV={scrollYProgress} />
            <EliteControlPanel progressMV={scrollYProgress} />
            <PerfectFlightPanel progressMV={scrollYProgress} />
            <HighTackPanel progressMV={scrollYProgress} />
            <ChampionPanel progressMV={scrollYProgress} />
          </div>
        </div>
      </div>
    </main>
  );
}
