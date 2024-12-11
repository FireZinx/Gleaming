import "../styles/global.css"
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import dynamic from 'next/dynamic';
import Home from "../components/Home"
import { CameraControls, Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { time } from "console";
import { M_PLUS_1, Prosto_One } from "next/font/google";
import { ButtonContextProvider } from "../components/DataContext";
import { Buttons } from "../components/Buttons";

export default function App({ Component, pageProps }: AppProps) {

  return(
    <ButtonContextProvider>
      <Canvas className={styles.three} gl={{antialias: true, stencil: false}} frameloop={"always"} dpr={2} camera={{ position: [-10, 2.3, 5], fov:75 }}>
        <Component />
        <PerspectiveCamera />
        {/* <CameraControls/> */}
      </Canvas>
      <div className={styles.container}>
        <Buttons/>
        <Home/>
      </div>
    </ButtonContextProvider>
  )
}
