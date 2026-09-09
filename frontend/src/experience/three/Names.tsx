import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { seg, lerp } from '../lib/math';
import { KIDS, TEACHERS_ALL } from '../data';
import { labelTexture } from '../lib/textures';

type Tag = {
  name: string;
  base: [number, number, number];
  kind: 'kid' | 'teacher';
  from: number;
  phase: number;
};

function scatter(i: number, total: number): [number, number, number] {
  const angle = (i / total) * Math.PI * 2 + i * 0.6;
  const radius = 1.4 + (i % 3) * 0.55;
  return [
    Math.cos(angle) * radius,
    0.9 + ((i * 0.37) % 1.5),
    -1.4 + Math.sin(angle) * radius,
  ];
}

function NameTag({ tag }: { tag: Tag }) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(
    () =>
      labelTexture(tag.name, {
        bg: tag.kind === 'teacher' ? 'rgba(255,241,214,0.96)' : 'rgba(255,255,255,0.94)',
        color: tag.kind === 'teacher' ? '#7a3f22' : '#2c2620',
      }),
    [tag.name, tag.kind],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = scrollStore.progress;
    const inK = seg(p, tag.from, tag.from + 0.12);
    const outK = seg(p, 0.78, 0.98);
    g.visible = inK > 0.001;
    const t = state.clock.elapsedTime + tag.phase;
    g.position.set(
      tag.base[0] + Math.sin(t * 0.6) * 0.12,
      tag.base[1] + Math.sin(t * 0.9) * 0.1 + outK * (5 + tag.phase),
      tag.base[2] + Math.cos(t * 0.5) * 0.12,
    );
    g.scale.setScalar(lerp(0.3, tag.kind === 'teacher' ? 0.62 : 0.5, inK) * (1 - outK * 0.4));
    g.lookAt(state.camera.position);
    const star = g.children[1] as THREE.Mesh | undefined;
    if (star) {
      const m = star.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.5;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <icosahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color="#ffdf8a" emissive="#ffcf6a" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

export function Names() {
  const tags = useMemo<Tag[]>(() => {
    const kids: Tag[] = KIDS.slice(4).map((name, i) => ({
      name,
      kind: 'kid',
      base: scatter(i, KIDS.length - 4),
      from: 0.52 + i * 0.015,
      phase: i * 1.3,
    }));
    const teachers: Tag[] = TEACHERS_ALL.map((name, i) => ({
      name,
      kind: 'teacher',
      base: scatter(i + 3, TEACHERS_ALL.length + 3),
      from: 0.66 + i * 0.014,
      phase: i * 0.9 + 2,
    }));
    return [...kids, ...teachers];
  }, []);

  return (
    <group>
      {tags.map((tag, i) => (
        <NameTag key={`${tag.kind}-${tag.name}-${i}`} tag={tag} />
      ))}
    </group>
  );
}
