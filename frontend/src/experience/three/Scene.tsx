import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { scrollStore } from '../scrollStore';
import { CAMERA_TRACK } from '../track';
import { sampleTrack, damp, seg } from '../lib/math';
import type { Tier, TierSettings } from '../lib/quality';
import { Sky } from './Sky';
import { School } from './School';
import { Classroom } from './Classroom';
import { Names } from './Names';
import { Motes } from './Motes';
import { HeartTree } from './HeartTree';

type Props = { tier: Exclude<Tier, 'static'>; settings: TierSettings };

const target = new THREE.Vector3();
const desiredPos = new THREE.Vector3();

function Rig({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 1.4, 0));
  const zoom = mobile ? 1.22 : 1;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { pos, tgt } = sampleTrack(CAMERA_TRACK, scrollStore.progress);
    // En mobile la cámara se aleja un poco para compensar el FOV más amplio.
    desiredPos.set(pos[0], pos[1], pos[2] >= 0 ? pos[2] * zoom : pos[2] - (zoom - 1) * 2);
    target.set(tgt[0], tgt[1], tgt[2]);

    camera.position.set(
      damp(camera.position.x, desiredPos.x, 6, dt),
      damp(camera.position.y, desiredPos.y, 6, dt),
      damp(camera.position.z, desiredPos.z, 6, dt),
    );
    look.current.set(
      damp(look.current.x, target.x, 6, dt),
      damp(look.current.y, target.y, 6, dt),
      damp(look.current.z, target.z, 6, dt),
    );
    camera.lookAt(look.current);
  });
  return null;
}

function Lights({ shadows }: { shadows: boolean }) {
  const warm = useRef<THREE.PointLight>(null);
  useFrame(() => {
    // La luz interior sube al abrirse la puerta y se mantiene dentro del aula.
    const open = seg(scrollStore.progress, 0.22, 0.34);
    const inside = seg(scrollStore.progress, 0.3, 0.5);
    if (warm.current) warm.current.intensity = 6 + open * 14 + inside * 20;
  });
  return (
    <>
      <hemisphereLight args={['#dfeaff', '#b98a5a', 0.55]} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.15}
        color="#ffe9c8"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight ref={warm} position={[0, 1.4, -1.5]} color="#ffb867" distance={16} decay={2} />
    </>
  );
}

function Content({ settings }: { settings: TierSettings }) {
  return (
    <>
      <Sky count={settings.clouds} />
      <Lights shadows={settings.shadows} />
      <School shadows={settings.shadows} />
      <Classroom settings={settings} />
      <Names />
      <Motes count={settings.motes} />
      <HeartTree leaves={settings.leaves} />
    </>
  );
}

export default function Scene({ tier, settings }: Props) {
  const mobile = tier === 'low';
  return (
    <Canvas
      shadows={settings.shadows}
      dpr={settings.dpr}
      gl={{ antialias: !mobile, powerPreference: 'high-performance' }}
      camera={{ fov: mobile ? 62 : 52, near: 0.1, far: 120, position: [0, 3.6, 17] }}
      onCreated={({ gl, invalidate, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        scene.fog = new THREE.Fog('#0f2438', mobile ? 34 : 44, 96);
        scene.background = new THREE.Color('#132a41');
        scrollStore.bindInvalidate(invalidate);
      }}
    >
      <PerformanceMonitor onDecline={() => undefined}>
        <AdaptiveDpr pixelated={false} />
        <Rig mobile={mobile} />
        <Suspense fallback={null}>
          <Content settings={settings} />
        </Suspense>
        {settings.postFx && (
          <EffectComposer>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.62}
              luminanceSmoothing={0.25}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.3} darkness={0.62} />
          </EffectComposer>
        )}
      </PerformanceMonitor>
    </Canvas>
  );
}
