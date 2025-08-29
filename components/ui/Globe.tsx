"use client";

import React, { useEffect, useRef, useState } from "react";
import { Color } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";




export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface GlobeProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// Utility to convert hex to RGB
function hexToRgb(hex: string) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

// Utility to generate unique random numbers
function genRandomNumbers(min: number, max: number, count: number): number[] {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return Array.from(nums);
}

// Scene component with ThreeGlobe logic
function GlobeScene({ globeConfig, data }: GlobeProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const [globeObject, setGlobeObject] = useState<ThreeGlobe | null>(null);

  const config = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: false,
    autoRotateSpeed: 0.001,
    ...globeConfig,
  };

  useEffect(() => {
    const globe = new ThreeGlobe();
    globeRef.current = globe;
    setGlobeObject(globe);

    // Globe material setup
    const material = globe.globeMaterial() as any;
    material.color = new Color(config.globeColor);
    material.emissive = new Color(config.emissive);
    material.emissiveIntensity = config.emissiveIntensity;
    material.shininess = config.shininess;

    // Country polygons
    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    // Arcs
    globe
      .arcsData(data)
      .arcStartLat((d) => (d as Position).startLat)
      .arcStartLng((d) => (d as Position).startLng)
      .arcEndLat((d) => (d as Position).endLat)
      .arcEndLng((d) => (d as Position).endLng)
      .arcAltitude((d) => (d as Position).arcAlt)
      .arcAltitude((d) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(config.arcLength)
      .arcDashGap(15)
      .arcDashInitialGap((d) => (d as Position).order)
      .arcDashAnimateTime(config.arcTime);

    // Points
    globe
      .pointsData(data)
      .pointColor((d) => (d as Position).color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(config.pointSize);

    return () => {
      globe.clear();
    };
  }, [data, globeConfig]);

  // Animate rings
  useEffect(() => {
    const interval = setInterval(() => {
      if (!globeRef.current) return;
      const active = genRandomNumbers(
        0,
        data.length,
        Math.floor(data.length * 0.8)
      );
      const rings = data
        .filter((_, i) => active.includes(i))
        .map((d) => {
          const rgb = hexToRgb(d.color)!;
          return {
            lat: d.startLat,
            lng: d.startLng,
            color: (t: number) => `rgba(${rgb.r},${rgb.g},${rgb.b},${1 - t})`,
          };
        });

      globeRef.current.ringsData(rings);
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  useFrame(() => {
    if (config.autoRotate && globeRef.current) {
      globeRef.current.rotation.y += config.autoRotateSpeed;
    }
  });

  if (!globeObject) return null;
  return <primitive object={globeObject} />;
}

// Public wrapper component
export function Globe({ globeConfig, data }: GlobeProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;
  return (
    <Canvas camera={{ position: [0, 0, 300] }}>
      <ambientLight />
      <pointLight position={[50, 50, 50]} />
      <GlobeScene globeConfig={globeConfig} data={data} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
