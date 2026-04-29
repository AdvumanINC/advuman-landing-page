"use client";

import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type PedestalProps = {
  progressMV: MotionValue<number>;
};

const SHOW_RANGE = { start: 0.82, full: 0.92, end: 1.0 };

function visibilityFromProgress(p: number): number {
  if (p <= SHOW_RANGE.start) return 0;
  if (p >= SHOW_RANGE.full) return 1;
  return (p - SHOW_RANGE.start) / (SHOW_RANGE.full - SHOW_RANGE.start);
}

export function Pedestal({ progressMV }: PedestalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tierMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const rimMats = useRef<THREE.MeshBasicMaterial[]>([]);

  const pedestalGeoms = useMemo(
    () => ({
      top: new THREE.CylinderGeometry(1.05, 1.05, 0.55, 64),
      mid: new THREE.CylinderGeometry(1.55, 1.55, 0.18, 64),
      base: new THREE.CylinderGeometry(2.1, 2.1, 0.35, 64),
      topRim: new THREE.TorusGeometry(1.05, 0.018, 16, 96),
      midRim: new THREE.TorusGeometry(1.55, 0.012, 16, 96),
    }),
    [],
  );

  useFrame(() => {
    const p = progressMV.get();
    const vis = visibilityFromProgress(p);

    if (groupRef.current) {
      groupRef.current.visible = vis > 0.001;
      groupRef.current.scale.setScalar(0.85 + vis * 0.15);
    }

    for (const m of tierMats.current) {
      m.opacity = vis * 0.95;
      m.transparent = true;
    }
    for (const m of rimMats.current) {
      m.opacity = vis;
      m.transparent = true;
    }
  });

  const setTierMat = (i: number) => (mat: THREE.MeshStandardMaterial | null) => {
    if (mat) tierMats.current[i] = mat;
  };
  const setRimMat = (i: number) => (mat: THREE.MeshBasicMaterial | null) => {
    if (mat) rimMats.current[i] = mat;
  };

  return (
    <group ref={groupRef} position={[0, -1.15, 0]}>
      {/* Top platform — directly under the ball */}
      <mesh geometry={pedestalGeoms.top} position={[0, 0, 0]} receiveShadow castShadow>
        <meshStandardMaterial
          ref={setTierMat(0)}
          color="#0c0c0c"
          roughness={0.5}
          metalness={0.4}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh geometry={pedestalGeoms.topRim} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.28, 0]}>
        <meshBasicMaterial ref={setRimMat(0)} color="#ffffff" transparent opacity={0} />
      </mesh>

      {/* Middle disc */}
      <mesh geometry={pedestalGeoms.mid} position={[0, -0.36, 0]} receiveShadow castShadow>
        <meshStandardMaterial
          ref={setTierMat(1)}
          color="#0a0a0a"
          roughness={0.55}
          metalness={0.3}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh geometry={pedestalGeoms.midRim} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.27, 0]}>
        <meshBasicMaterial ref={setRimMat(1)} color="#cccccc" transparent opacity={0} />
      </mesh>

      {/* Base disc */}
      <mesh geometry={pedestalGeoms.base} position={[0, -0.62, 0]} receiveShadow castShadow>
        <meshStandardMaterial
          ref={setTierMat(2)}
          color="#0a0a0a"
          roughness={0.6}
          metalness={0.25}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}
