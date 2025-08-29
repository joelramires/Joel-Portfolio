"use client";

import { useEffect, useState } from "react";
import Globe from "../GlobeWrapper"; // safe dynamic import

const GridGlobe = () => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",
    showAtmosphere: true,
    atmosphereColor: "#FFFFFF",
    atmosphereAltitude: 0.1,
    emissive: "#062056",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const arcs = [
    {
      order: 1,
      startLat: 40.7128,
      startLng: -74.006,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.3,
      color: "#06b6d4",
    },
  ];

  return (
    <div className="relative w-full h-[30rem] flex items-center justify-center">
      <div className="w-full max-w-6xl h-full">
        <Globe data={arcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
};

export default GridGlobe;
