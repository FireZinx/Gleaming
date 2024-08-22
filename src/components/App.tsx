import type { AppProps } from "next/app";
import styles from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";
import dynamic from 'next/dynamic';
import { lazy, useEffect } from 'react';
import Home from "../pages/Home";

const work = new Worker(new URL("./Worker", import.meta.url), { type: "module" })

export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
        {/* <Home/> */}
        <Canvas worker={work} className={styles.three}  frameloop={"demand"} dpr={2} camera={{ position: [0, 0, 8] }}>
            <Component {...pageProps} />;
        </Canvas>
    </>
  )
}
