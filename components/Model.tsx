"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type BallStop = {
  p: number;
  x: number;
  y: number;
  z: number;
  scale: number;
};

const BALL_STOPS: BallStop[] = [
  { p: 0.0, x: 0, y: 0, z: 0, scale: 0.775 },
  { p: 0.15, x: 0, y: 0, z: 0, scale: 0.775 },
  // Elite Control — globe drifts right, cropped at right edge of frame
  { p: 0.3, x: 1.1, y: 0, z: 0, scale: 0.875 },
  { p: 0.4, x: 1.1, y: 0, z: 0, scale: 0.875 },
  // Perfect Flight — globe pushed far left, scaled up so only the right half shows
  { p: 0.5, x: -1.7, y: 0, z: 0.3, scale: 1.25 },
  { p: 0.6, x: -1.7, y: 0, z: 0.3, scale: 1.25 },
  // High-Tack diagram — center, smaller so the rings frame it
  { p: 0.7, x: 0, y: 0, z: 0, scale: 0.5 },
  { p: 0.8, x: 0, y: 0, z: 0, scale: 0.5 },
  // Champion — center, slightly elevated above the pedestal
  { p: 0.9, x: 0, y: 0.45, z: 0, scale: 0.625 },
  { p: 1.0, x: 0, y: 0.45, z: 0, scale: 0.625 },
];

function sampleStops(progress: number): BallStop {
  const clamped = Math.max(0, Math.min(1, progress));
  for (let i = 1; i < BALL_STOPS.length; i++) {
    const b = BALL_STOPS[i];
    if (clamped <= b.p) {
      const a = BALL_STOPS[i - 1];
      const t = (clamped - a.p) / (b.p - a.p || 1);
      const eased = t * t * (3 - 2 * t);
      return {
        p: clamped,
        x: THREE.MathUtils.lerp(a.x, b.x, eased),
        y: THREE.MathUtils.lerp(a.y, b.y, eased),
        z: THREE.MathUtils.lerp(a.z, b.z, eased),
        scale: THREE.MathUtils.lerp(a.scale, b.scale, eased),
      };
    }
  }
  return BALL_STOPS[BALL_STOPS.length - 1];
}

type ModelProps = {
  progressMV: MotionValue<number>;
};

function Globe({ progressMV }: ModelProps) {
  const mapTexture = useTexture("/map.png");

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  useEffect(() => {
    mapTexture.colorSpace = THREE.SRGBColorSpace;
    mapTexture.anisotropy = 16;
  }, [mapTexture]);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    const t = state.clock.elapsedTime;
    const progress = progressMV.get();
    const target = sampleStops(progress);

    const damping = Math.min(1, delta * 5);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      target.x,
      damping,
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      target.y + Math.sin(t * 0.7) * 0.06,
      damping,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      target.z,
      damping,
    );

    const newScale = THREE.MathUtils.lerp(groupRef.current.scale.x, target.scale, damping);
    groupRef.current.scale.setScalar(newScale);

    // Continuous spin + scroll-driven rotation (no cursor tracking)
    const mx = 0;
    const my = 0;
    const baseSpinY = t * 1.1 + progress * Math.PI * 1.4;
    const targetRotY = baseSpinY + mx * 0.35;
    const targetRotX = my * 0.2 + Math.sin(t * 0.35) * 0.08;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotY,
      Math.min(1, delta * 2.0),
    );
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotX,
      Math.min(1, delta * 2.0),
    );
  });

  return (
    <group ref={groupRef}>
      <group ref={meshRef}>
        {/* Globe sphere with world map */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 128, 128]} />
          <meshStandardMaterial
            map={mapTexture}
            roughness={0.65}
            metalness={0.08}
          />
        </mesh>

        {/* Subtle atmospheric glow shell */}
        <mesh>
          <sphereGeometry args={[1.018, 64, 64]} />
          <meshStandardMaterial
            color="#aaddff"
            transparent
            opacity={0.04}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

export function Model({ progressMV }: ModelProps) {
  return <Globe progressMV={progressMV} />;
}
