import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeRng } from '../lib/math';

const STAR_COUNT = 320;

const STAR_POSITIONS: Float32Array = (() => {
  const rng = makeRng(97);
  const arr = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 55 + rng() * 30;
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.cos(phi) * 0.7 + 6;
    arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return arr;
})();

function Stars() {
  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.006;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.12;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[STAR_POSITIONS, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.42}
        sizeAttenuation
        color="#fff3d0"
        transparent
        depthWrite={false}
      />
    </points>
  );
}

const CLOUD_PARTS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 0, 0, 1],
  [0.9, -0.1, 0.2, 0.75],
  [-0.9, -0.05, -0.1, 0.7],
  [0.3, 0.35, -0.2, 0.6],
];

function Cloud({
  position,
  scale,
  drift,
}: {
  position: [number, number, number];
  scale: number;
  drift: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x =
        position[0] + Math.sin(state.clock.elapsedTime * 0.05 + drift) * 1.2;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {CLOUD_PARTS.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[s * 1.5, s, s]}>
          <sphereGeometry args={[1, 14, 12]} />
          <meshStandardMaterial
            color="#fdfaf3"
            roughness={1}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

const CLOUD_SLOTS: Array<{
  position: [number, number, number];
  scale: number;
  drift: number;
}> = [
  { position: [-6, 4.5, -3], scale: 1.1, drift: 0 },
  { position: [7, 3.2, -5], scale: 0.9, drift: 1.7 },
  { position: [-4, 1.5, 6], scale: 0.8, drift: 3.1 },
  { position: [5.5, 5.5, 3], scale: 0.75, drift: 4.4 },
  { position: [0, 6.5, -8], scale: 1.3, drift: 5.9 },
];

export function Sky({ count }: { count: number }) {
  return (
    <group>
      <Stars />
      {CLOUD_SLOTS.slice(0, count).map((c, i) => (
        <Cloud key={i} position={c.position} scale={c.scale} drift={c.drift} />
      ))}
    </group>
  );
}
