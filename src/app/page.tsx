"use client"
export const dynamic = "force-static";

import styles from "./page.module.css";
import { Canvas, useFrame } from "@react-three/fiber";
import HomeDefault from "../app/components/Home"
import { CameraControls, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { ButtonContextProvider } from "../app/components/DataContext";
import { Buttons } from "../app/components/Buttons";
import Scene from "../app/components/scene";

export default function Home() {
  return (
    <ButtonContextProvider>
      <Canvas className={styles.three} gl={{antialias: false, stencil: false}} frameloop={"always"} dpr={1} camera={{ position: [-10, 2.3, 5], fov:75 }}>
        <PerspectiveCamera />
        <Scene/>
        {/* <CameraControls/> */}
      </Canvas>
      
      <div id={"container"} className={styles.container}>
        <HomeDefault/>
        <Buttons/>
      </div>
    </ButtonContextProvider>
  );
}
