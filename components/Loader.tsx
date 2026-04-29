"use client";

import { Html } from "@react-three/drei";

export function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="loader-ring" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Loading
        </span>
      </div>
    </Html>
  );
}
