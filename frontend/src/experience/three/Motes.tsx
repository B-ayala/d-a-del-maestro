import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { seg, makeRng } from '../lib/math';

const dummy = new THREE.Object3D();
const MAX_MOTES = 420;

type MoteSeed = {
  x: number;
  y: number;
  z: number;
  speed: number;
  phase: number;
  scale: number;
};

const MOTE_POOL: readonly MoteSeed[] = (() => {
  const rng = makeRng(4242);
  return Array.from({ length: MAX_MOTES }, () => ({
    x: (rng() - 0.5) * 8,
    y: rng() * 4 + 0.2,
    z: (rng() - 0.5) * 8 - 1.5,
    speed: 0.15 + rng() * 0.4,
    phase: rng() * Math.PI * 2,
    scale: 0.015 + rng() * 0.04,
  }));
})();

export function Motes({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  const seeds = useMemo(
    () => MOTE_POOL.slice(0, Math.min(count, MAX_MOTES)),
    [count],
  );

  useFrame((state) => {
    const p = scrollStore.progress;
    const appear = seg(p, 0.2, 0.42);
    const fade = 1 - seg(p, 0.82, 0.96);
    if (material.current) material.current.opacity = appear * fade * 0.9;
    const m = mesh.current;
    if (!m) return;
    m.visible = appear * fade > 0.01;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i]!;
      dummy.position.set(
        s.x + Math.sin(t * s.speed + s.phase) * 0.6,
        s.y + ((t * s.speed * 0.3 + s.phase) % 4) - 0.5,
        s.z + Math.cos(t * s.speed + s.phase) * 0.6,
      );
      const tw = 0.6 + Math.sin(t * 3 + s.phase) * 0.4;
      dummy.scale.setScalar(s.scale * tw);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        ref={material}
        color="#ffe6ad"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
