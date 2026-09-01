"use client"
export const dynamic = "force-static";

import styles from "./page.module.css";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { ButtonContextProvider } from "../app/components/DataContext";
import { Buttons } from "../app/components/Buttons";

import HomeDefault from "../app/components/Home"
import Scene from "../app/components/scene";
import AlertWidget from "../app/components/AlertWidget";


export default function Home() {
  return (
    <ButtonContextProvider>
      <Canvas className={styles.three} gl={{antialias: false, stencil: false}} frameloop={"always"} dpr={1.5} camera={{ position: [-10, 2.3, 5], fov:75 }}>
        <PerspectiveCamera />
        <Scene/>
        {/* <CameraControls/> */}
      </Canvas>
      
      <div id={"container"} className={styles.container}>
        <HomeDefault/>
        <Buttons/>
        <AlertWidget/>
      </div>
    </ButtonContextProvider>
  );
}

