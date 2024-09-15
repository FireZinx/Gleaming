import "../styles/global.css"
import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import dynamic from 'next/dynamic';
import Home from "../components/Home"
import { Html, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { MathUtils, Vector3 } from "three";
import { time } from "console";
import { M_PLUS_1, Prosto_One } from "next/font/google";

export default function App({ Component, pageProps }: AppProps) {

  return(
    <>
      <Canvas className={styles.three} gl={{antialias: true, stencil: false}} frameloop={"always"} dpr={2} camera={{ position: [-10, 2.5, 5], fov:75 }}>
        <Component />
        <PerspectiveCamera />
      </Canvas>
      <Home/>
    </>
  )
}
