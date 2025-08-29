"use client";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./ui/Globe").then((m) => m.Globe), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-black">Loading globe...</div>,
});

export default Globe;
