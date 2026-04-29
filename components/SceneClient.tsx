"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { MotionValue } from "framer-motion";

type SceneProps = {
  progressMV: MotionValue<number>;
};

export const SceneClient = dynamic(
  () => import("./Scene").then((m) => m.Scene as unknown as ComponentType<SceneProps>),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div className="loader-ring" />
      </div>
    ),
  },
) as ComponentType<SceneProps>;
