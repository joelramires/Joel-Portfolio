import { ThreeGlobe } from "three-globe";
import { Object3DNode } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    primitive: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}
