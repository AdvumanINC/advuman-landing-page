"use client";

import { Canvas } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { Suspense } from "react";
import { Loader } from "./Loader";
import { Model } from "./Model";
import { Pedestal } from "./Pedestal";

type SceneProps = {
  progressMV: MotionValue<number>;
};

export function Scene({ progressMV }: SceneProps) {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        className="!pointer-events-none"
      >
        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 6, 4]}
          intensity={2.5}
          color="#ffffff"
          castShadow
        />

        <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#fffbe0" />

        {/* Yellow rim light behind the globe */}
        <pointLight
          position={[0, 0, -3.2]}
          intensity={5}
          color="#FFD200"
          distance={10}
          decay={1.5}
        />

        {/* Subtle yellow bounce from below */}
        <pointLight
          position={[0, -2, 2]}
          intensity={0.5}
          color="#FFD200"
          distance={8}
        />

        <Suspense fallback={<Loader />}>
          <Model progressMV={progressMV} />
          <Pedestal progressMV={progressMV} />
        </Suspense>
      </Canvas>
    </div>
  );
}
