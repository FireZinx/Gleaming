import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "../styles/Home.module.css";
import { useFrame, useLoader, useGraph, useThree, extend} from '@react-three/fiber'
import { Canvas, render } from "@react-three/offscreen"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { SoftShadows, Environment, Reflector, useGLTF, RandomizedLight, OrbitControls, PerspectiveCamera, SpotLight, Stats, useTexture, Lightformer, MeshTransmissionMaterial, MeshReflectorMaterial, useProgress} from '@react-three/drei'
import { createRoot } from 'react-dom/client'
import { Leva, useControls } from 'leva'
import { useEffect, Suspense, useRef, useState, forwardRef} from "react"
import { useSpring, animated } from '@react-spring/three'
import { Camera, WebGLCubeRenderTarget, DoubleSide} from "three";
import {Bloom, EffectComposer, GodRays} from "@react-three/postprocessing";
import {KernelSize, Resolution} from "postprocessing"
import { DefaultLoadingManager } from "three";

function Windows(props) {
  const Window = useGLTF("Window.glb")
  const Glass = useGLTF("glass.glb")
  const texture = useTexture("Window.png")

  texture.flipY = false
  texture.channel = 1

  return(
    <group {...props} dispose={null}>
      <group position={[-0.254, 0.2, 4.014]} scale={[1.399, 1.389, 1.40]}>
        <mesh geometry={Window.nodes.Cube005.geometry}>
          <meshPhysicalMaterial map={texture} side={DoubleSide}/>
        </mesh>
      </group>

      <group>
        <mesh geometry={Glass.nodes.Plane006.geometry} position={[-0.26, 0.12, 4.024]} scale={[1.4, 1.1, 1.1]} rotation={[0, -  Math.PI/2,Math.PI / 2]}>
          <MeshTransmissionMaterial thickness={0.01}  resolution={2048} ior={1.25} roughness={0.09} transmission={0.95} clearcoat={1} clearcoatRoughness={0} transparent={false}/>
        </mesh>
      </group>
    </group>
  )
}

function Roof(props){
  const {nodes, materials} = useGLTF("Roof.glb")
  const texture = useTexture("Roof.png")
  const multiply = 1
  texture.flipY = false
  texture.channel = 1

  return(
    <group {...props} position={[0.08, 3.295 , -0.25  ]} scale={[1.399, 1, 1.395]}>
      <mesh geometry={nodes.Plane001.geometry}>
        <meshPhysicalMaterial map={texture}/>
      </mesh> 
    </group>
  )
}

function Floor(props) {
  const floor = useGLTF("Floor.glb")
  const texture = useTexture("Floor8K.png")
  const multiply = 1

  texture.flipY = false
  texture.channel = 1

  return (
    <group {...props} position={[4.33, 0.19, 2.6]} scale={[1.4, 1.4, 1.4]} rotation={[-Math.PI/2, 0, 0]}>
      <mesh geometry={floor.nodes.Plane003.geometry}>
        <MeshReflectorMaterial
          blur={[1600, 800]}
          resolution={512}
          mirror={0.2}
          mixBlur={0.8}
          mixStrength={1}
          map={texture}
        />
      </mesh>
    </group>
  )
}

function Walls(props) {
  const { nodes } = useGLTF("untitled.glb")
  const texture = useTexture("Walls8k.png")

  texture.flipY = false
  texture.channel = 1

  return (
    <>
      <group {...props} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={nodes.Plane.geometry} >
          <meshPhysicalMaterial map={texture} roughness={0.95}/>
        </mesh>
      </group>
    </>
  )
}

function Sky(props){
  const {gl} = useThree()
  const texture = useTexture("skyBox.png")
  const format = new WebGLCubeRenderTarget(texture.image.height).fromEquirectangularTexture(gl, texture)

  return(
    <>
      <color attach="background" args={["#BEDCF5"]}/>
    </>
  )
}

const Sun = forwardRef((props, forwardRef) => {
  return (
    <mesh ref={forwardRef} position={[-20, 4, 0]} scale={[1, 1, 1]} >
      <sphereGeometry />
      <meshBasicMaterial/>
    </mesh>
  );
})

function Rays(){
  const [material, set] = useState() 

  return(
    <>
      <Sun ref={set}/>
      { material && (
        <EffectComposer enableNormalPass multisampling={1}>
          <GodRays sun={material} samples={50} exposure={1.2} />
          <Bloom
            intensity={1}
            kernelSize={KernelSize.SMALL}
            luminanceThreshold={2}
            luminanceSmoothing={0.5}
            mipmapBlur={false}
            resolutionX={Resolution.AUTO_SIZE}
            resolutionY={Resolution.AUTO_SIZE}
          />
        </EffectComposer>
      )}
    </>
  )
}

export default function HomeCanvas() {
  return (
    <>
      <Stats/>
      <Rays/>

      <ambientLight intensity={2}/>

      <OrbitControls />

      <Suspense fallback={null}>
        <Roof />
        <Floor />
        <Walls />
        <Windows />
        <Sky/>
      </Suspense>
    </>
  );
}