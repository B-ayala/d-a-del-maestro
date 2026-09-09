import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { seg, lerp } from '../lib/math';
import { heartLeaves } from '../lib/heart';
import { ROOT_WORDS } from '../data';
import { labelTexture } from '../lib/textures';

const dummy = new THREE.Object3D();
const colDim = new THREE.Color('#2f7d57');
const colLit = new THREE.Color('#ffd36a');
const tmp = new THREE.Color();

function Roots() {
  const group = useRef<THREE.Group>(null);
  const roots = useMemo(
    () =>
      ROOT_WORDS.map((word, i) => {
        const angle = (i / ROOT_WORDS.length) * Math.PI * 2;
        return {
          word,
          angle,
          texture: labelTexture(word, { bg: 'transparent', color: '#ffe9c4', font: '600 66px system-ui, sans-serif' }),
        };
      }),
    [],
  );
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const k = seg(scrollStore.progress, 0.86, 0.95);
    g.visible = k > 0.01;
    g.traverse((o) => {
      const mat = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (mat && 'opacity' in mat) {
        mat.transparent = true;
        mat.opacity = k;
      }
    });
  });
  return (
    <group ref={group}>
      {roots.map((r, i) => (
        <group key={i} rotation={[0, r.angle, 0]}>
          <mesh position={[0, -1.4, 2.2]} rotation={[Math.PI / 3.2, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.26, 4.2, 6]} />
            <meshStandardMaterial color="#7a5334" roughness={1} transparent />
          </mesh>
          <mesh position={[0, -2.7, 4.3]}>
            <planeGeometry args={[2.4, 1.2]} />
            <meshStandardMaterial map={r.texture} transparent depthWrite={false} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Leaves({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const points = useMemo(() => heartLeaves(count, 0.52), [count]);

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const p = scrollStore.progress;
    const lit = seg(p, 0.9, 1.0);
    for (let i = 0; i < points.length; i++) {
      const pt = points[i]!;
      const on = pt.order <= lit ? 1 : 0;
      const s = lerp(0.06, 0.16, on) * (0.85 + Math.sin(i + p * 20) * 0.15 * on);
      dummy.position.set(pt.x, pt.y, pt.z);
      dummy.scale.setScalar(s);
      dummy.rotation.set(i, i * 0.5, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      tmp.copy(on ? colLit : colDim);
      m.setColorAt(i, tmp);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial emissive="#ffbf5c" emissiveIntensity={0.9} toneMapped={false} roughness={0.6} />
    </instancedMesh>
  );
}

export function HeartTree({ leaves }: { leaves: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const k = seg(scrollStore.progress, 0.83, 0.92);
    g.visible = k > 0.01;
    g.scale.setScalar(lerp(0.75, 1, k));
    g.rotation.y = Math.sin(state.clock.elapsedTime * 0.08) * 0.05;
  });

  return (
    <group ref={group} position={[0, -13.5, 0]}>
      <mesh position={[0, -3.5, 0]}>
        <cylinderGeometry args={[0.55, 1.1, 6, 8]} />
        <meshStandardMaterial color="#6b4a30" roughness={1} />
      </mesh>
      {[
        [0.6, -0.4, 0, 0.5],
        [-0.6, -0.2, 0, -0.5],
        [0, 0.4, 0.5, 0.2],
      ].map(([x, y, z, rot], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]}>
          <cylinderGeometry args={[0.2, 0.35, 2.4, 6]} />
          <meshStandardMaterial color="#6b4a30" roughness={1} />
        </mesh>
      ))}
      <Leaves count={leaves} />
      <Roots />
    </group>
  );
}
