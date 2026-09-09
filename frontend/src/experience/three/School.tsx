import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { seg, lerp } from '../lib/math';

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.7, 6]} />
        <meshStandardMaterial color="#8a5a3c" roughness={1} />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#3f8f5f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.36, 0.9, 8]} />
        <meshStandardMaterial color="#4fa06c" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function School({ shadows }: { shadows: boolean }) {
  const group = useRef<THREE.Group>(null);
  const door = useRef<THREE.Group>(null);
  const windowMat = useRef<THREE.MeshStandardMaterial>(null);

  const trees = useMemo(
    () =>
      [
        { position: [-3.1, 0, 1.6] as [number, number, number], scale: 1 },
        { position: [3.2, 0, 0.6] as [number, number, number], scale: 0.85 },
        { position: [2.4, 0, 2.6] as [number, number, number], scale: 0.7 },
        { position: [-2.6, 0, -1.8] as [number, number, number], scale: 0.9 },
      ] as const,
    [],
  );

  useFrame((state) => {
    const p = scrollStore.progress;
    if (door.current) {
      door.current.rotation.y = -seg(p, 0.22, 0.34) * (Math.PI * 0.62);
    }
    if (windowMat.current) {
      windowMat.current.emissiveIntensity = 0.15 + seg(p, 0.28, 0.5) * 2.4;
    }
    if (group.current) {
      const lift = seg(p, 0.76, 0.94);
      group.current.position.y = lerp(0, 2.4, lift);
      const s = lerp(1, 0.82, lift);
      group.current.scale.setScalar(s);
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {/* Isla flotante */}
      <mesh position={[0, -0.9, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 2.2, 1.6, 24]} />
        <meshStandardMaterial color="#6b4a34" roughness={1} />
      </mesh>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <cylinderGeometry args={[4.4, 4.4, 0.2, 24]} />
        <meshStandardMaterial color="#5aa06a" roughness={1} />
      </mesh>

      {/* Cuerpo de la escuela (poco profundo: se atraviesa al entrar) */}
      <mesh position={[0, 1.2, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[4, 2.4, 2.2]} />
        <meshStandardMaterial color="#f6ead3" roughness={0.85} />
      </mesh>
      {/* Techo */}
      <mesh position={[0, 3.05, 0.1]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.1, 1.7, 4]} />
        <meshStandardMaterial color="#d9653f" roughness={0.8} />
      </mesh>
      {/* Ventanas (cara +Z) */}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.5, 1.22]}>
          <planeGeometry args={[0.9, 0.9]} />
          <meshStandardMaterial
            ref={x < 0 ? windowMat : undefined}
            color="#9fd2ff"
            emissive="#ffcf8a"
            emissiveIntensity={0.15}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Marco de la puerta + puerta con bisagra */}
      <mesh position={[0, 0.85, 1.21]}>
        <planeGeometry args={[1.15, 1.9]} />
        <meshStandardMaterial color="#3a2a20" />
      </mesh>
      <group ref={door} position={[-0.5, 0.05, 1.23]}>
        <mesh position={[0.5, 0.85, 0]} castShadow>
          <boxGeometry args={[1, 1.8, 0.08]} />
          <meshStandardMaterial color="#a9673d" roughness={0.7} />
        </mesh>
        <mesh position={[0.82, 0.85, 0.06]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#f0c460" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {trees.map((t, i) => (
        <Tree key={i} position={[...t.position]} scale={t.scale} />
      ))}

      <ambientLight intensity={shadows ? 0.12 : 0.28} />
    </group>
  );
}
