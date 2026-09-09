import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { seg, lerp } from '../lib/math';
import type { TierSettings } from '../lib/quality';
import { KIDS, TEACHERS_MAIN, TEACHERS_TARDE, JUAN_SRC } from '../data';
import { blackboardTexture, drawingTexture } from '../lib/textures';

const WALL = '#f0e4cf';

function useReveal(from: number, to: number) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const k = seg(scrollStore.progress, from, to);
    g.visible = k > 0.001;
    g.scale.setScalar(lerp(0.6, 1, k));
    g.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (mat && 'opacity' in mat) {
        mat.transparent = true;
        mat.opacity = k;
      }
    });
  });
  return ref;
}

function Pencils() {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () => [0, 1, 2, 3].map((i) => ({ a: i * 1.7, r: 0.8 + i * 0.25, y: 0.9 + i * 0.15 })),
    [],
  );
  useFrame((state) => {
    const p = scrollStore.progress;
    const alive = seg(p, 0.4, 0.5);
    const out = seg(p, 0.76, 0.96);
    const g = group.current;
    if (!g) return;
    g.visible = alive > 0.001;
    g.children.forEach((child, i) => {
      const s = seeds[i]!;
      const t = state.clock.elapsedTime;
      child.position.set(
        Math.cos(t * 0.5 + s.a) * s.r,
        s.y + Math.sin(t * 1.3 + s.a) * 0.15 + out * (6 + i),
        -1.6 + Math.sin(t * 0.4 + s.a) * s.r,
      );
      child.rotation.set(t * 0.6 + i, t * 0.3, s.a);
      const m = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      m.opacity = alive * (1 - out);
    });
  });
  return (
    <group ref={group}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
          <meshStandardMaterial
            color={['#e8b04a', '#e2704a', '#4f9d6c', '#7fb9dd'][i]}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

function JuanFrame() {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    let tex: THREE.Texture | undefined;
    new THREE.TextureLoader().load(JUAN_SRC, (loaded) => {
      loaded.colorSpace = THREE.SRGBColorSpace;
      tex = loaded;
      setTexture(loaded);
    });
    return () => tex?.dispose();
  }, []);

  useFrame((state) => {
    const p = scrollStore.progress;
    const show = seg(p, 0.4, 0.5);
    const out = seg(p, 0.78, 0.97);
    const g = ref.current;
    if (!g) return;
    g.visible = show > 0.001;
    g.position.set(2.66, 1.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03 + out * 7, -1.4);
    g.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.03 + out * 1.2;
  });
  return (
    <group ref={ref} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <boxGeometry args={[1.28, 1.5, 0.06]} />
        <meshStandardMaterial color="#8a5a3c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.06, 0.04]}>
        <planeGeometry args={[1.05, 1.2]} />
        <meshStandardMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.62, 0.04]}>
        <planeGeometry args={[1.05, 0.22]} />
        <meshStandardMaterial color="#fffaf0" />
      </mesh>
    </group>
  );
}

function Drawings() {
  const items = useMemo(
    () =>
      KIDS.slice(0, 4).map((name, i) => ({
        name,
        texture: drawingTexture(name, (i * 74) % 360),
        position: [-2.72, 1.7 - (i % 2) * 0.95, -2.6 + Math.floor(i / 2) * 1.9] as [number, number, number],
      })),
    [],
  );
  const ref = useReveal(0.5, 0.64);
  return (
    <group ref={ref}>
      {items.map((it) => (
        <mesh key={it.name} position={it.position} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial map={it.texture} transparent />
        </mesh>
      ))}
    </group>
  );
}

function Books({ count }: { count: number }) {
  const group = useRef<THREE.Group>(null);
  const slots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: -1.8 + (i % 3) * 1.8,
        z: -1.4 - Math.floor(i / 3) * 1.6,
      })),
    [count],
  );
  useFrame(() => {
    const open = seg(scrollStore.progress, 0.42, 0.56);
    const g = group.current;
    if (!g) return;
    g.children.forEach((book) => {
      const left = book.children[1] as THREE.Mesh | undefined;
      const right = book.children[2] as THREE.Mesh | undefined;
      if (left) left.rotation.y = lerp(0, -Math.PI * 0.75, open);
      if (right) right.rotation.y = lerp(0, Math.PI * 0.75, open);
    });
  });
  return (
    <group ref={group}>
      {slots.map((s, i) => (
        <group key={i} position={[s.x, 0.78, s.z]}>
          <mesh>
            <boxGeometry args={[0.36, 0.04, 0.28]} />
            <meshStandardMaterial color="#c98a3c" />
          </mesh>
          <mesh position={[-0.18, 0.03, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.28]} />
            <meshStandardMaterial color="#e2704a" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.18, 0.03, 0]}>
            <boxGeometry args={[0.36, 0.02, 0.28]} />
            <meshStandardMaterial color="#4f9d6c" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Desks({ count }: { count: number }) {
  const slots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => [
        -1.7 + (i % 3) * 1.7,
        0.55,
        -1.2 - Math.floor(i / 3) * 1.6,
      ] as [number, number, number]),
    [count],
  );
  return (
    <group>
      {slots.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.06, 0.6]} />
            <meshStandardMaterial color="#d8b98c" />
          </mesh>
          {[
            [-0.4, -0.28, -0.25],
            [0.4, -0.28, -0.25],
            [-0.4, -0.28, 0.25],
            [0.4, -0.28, 0.25],
          ].map((l, j) => (
            <mesh key={j} position={l as [number, number, number]}>
              <boxGeometry args={[0.06, 0.5, 0.06]} />
              <meshStandardMaterial color="#a9804f" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function Classroom({ settings }: { settings: TierSettings }) {
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const lampLight = useRef<THREE.PointLight>(null);
  const board = useMemo(
    () => blackboardTexture(TEACHERS_MAIN, TEACHERS_TARDE),
    [],
  );

  useFrame(() => {
    const on = seg(scrollStore.progress, 0.3, 0.5);
    if (lamp.current) lamp.current.emissiveIntensity = 0.1 + on * 3;
    if (lampLight.current) lampLight.current.intensity = on * 9;
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Cascarón del aula */}
      <mesh position={[0, 1.45, -4.2]} receiveShadow>
        <planeGeometry args={[5.6, 2.9]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[0, 0, -1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.6, 5.6]} />
        <meshStandardMaterial color="#c99a6a" />
      </mesh>
      <mesh position={[0, 2.9, -1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.6, 5.6]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[-2.8, 1.45, -1.4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.6, 2.9]} />
        <meshStandardMaterial color={WALL} />
      </mesh>
      <mesh position={[2.8, 1.45, -1.4]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5.6, 2.9]} />
        <meshStandardMaterial color={WALL} />
      </mesh>

      {/* Ventana en la pared izquierda */}
      <mesh position={[-2.78, 1.6, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshStandardMaterial color="#bfe0ff" emissive="#eaf4ff" emissiveIntensity={0.6} />
      </mesh>

      {/* Pizarrón */}
      <mesh position={[0, 1.5, -4.16]}>
        <planeGeometry args={[3.6, 1.7]} />
        <meshStandardMaterial map={board} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.5, -4.17]}>
        <boxGeometry args={[3.8, 1.9, 0.05]} />
        <meshStandardMaterial color="#7a5334" />
      </mesh>

      {/* Lámpara de techo */}
      <mesh position={[0, 2.78, -1.4]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial ref={lamp} color="#fff2d4" emissive="#ffd58a" emissiveIntensity={0.1} />
      </mesh>
      <pointLight ref={lampLight} position={[0, 2.6, -1.4]} color="#ffdca0" distance={10} decay={2} intensity={0} />

      <Desks count={settings.desks} />
      <Books count={settings.desks} />
      <Pencils />
      <Drawings />
      <JuanFrame />
    </group>
  );
}
