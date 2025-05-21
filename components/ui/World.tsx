"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Fog } from "three";
import { Globe, GlobeConfig } from "./Globe";
import { WebGLRendererConfig } from "./WebGLRendererConfig";

const aspect = 1.2;
const cameraZ = 300;

interface Position {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

export function World({ globeConfig, data }: WorldProps) {
  return (
    <Canvas
      camera={{ fov: 50, near: 180, far: 1800, position: [0, 0, cameraZ] }}
      onCreated={({ scene }) => {
        scene.fog = new Fog(0xffffff, 400, 2000);
      }}
    >
      <WebGLRendererConfig />

      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={[-400, 100, 400]}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={[-200, 500, 200]}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={[-200, 500, 200]}
        intensity={0.8}
      />

      <Globe globeConfig={globeConfig} data={data} />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed || 1}
        autoRotate={globeConfig.autoRotate}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
