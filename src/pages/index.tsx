import Head from "next/head";
import Image from "next/image";
import { Inter, Vampiro_One } from "next/font/google";
import styles from "../styles/Home.module.css";
import { useFrame, useLoader, useGraph, useThree, extend} from '@react-three/fiber'
import { Canvas, render } from "@react-three/offscreen"
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { SoftShadows, Environment, Reflector, useGLTF, RandomizedLight, SpotLight, Stats, useTexture, Lightformer, MeshTransmissionMaterial, MeshReflectorMaterial, useProgress, Html} from '@react-three/drei'
import { createRoot } from 'react-dom/client'
import { Leva, useControls } from 'leva'
import { useEffect, Suspense, useRef, useState, forwardRef, use} from "react"
import { useSpring, animated } from '@react-spring/three'
import { Vector3, Camera, WebGLCubeRenderTarget, DoubleSide, MathUtils, PerspectiveCamera, FrontSide} from "three";
import {Bloom, EffectComposer, GodRays} from "@react-three/postprocessing";
import {KernelSize, Resolution} from "postprocessing"
import { DefaultLoadingManager } from "three";
import { copyFileSync, stat } from "fs";
import { time } from "console";
import { off } from "process";

function Windows(props) {
  const Window = useGLTF("Window.glb")
  const Glass = useGLTF("glass.glb")
  const glassLightmap = useTexture("glass.jpg")
  const texture = useTexture("Window.jpg")

  texture.flipY = false
  texture.channel = 1

  glassLightmap.flipY = false
  glassLightmap.channel = 1

  return(
    <group {...props} dispose={null}>
      <group position={[-0.257, 0.2, 4.013]} scale={[1.399, 1.389, 1.405]}>
        <mesh geometry={Window.nodes.Cube005.geometry}>
          <meshPhysicalMaterial map={texture} side={DoubleSide}/>
        </mesh>
      </group>

      <group>
        <mesh geometry={Glass.nodes.Plane006.geometry} position={[-0.26, 0.12, 4.024]} scale={[1.4, 1.1, 1.1]} rotation={[0, -  Math.PI/2,Math.PI / 2]}>
          <MeshTransmissionMaterial thickness={0.01}  resolution={4096} ior={1.25} roughness={0.09} transmission={0.95} clearcoat={1} clearcoatRoughness={0} transparent={false}/>
        </mesh>
      </group>
    </group>
  )
}

function Roof(props){
  const {nodes, materials} = useGLTF("Roof.glb")
  const texture = useTexture("Roof.jpg")
  const multiply = 1
  texture.flipY = false
  texture.channel = 1

  return(
    <group {...props} position={[0.08, 3.39 , -0.24  ]} scale={[1.399, 1.4, 1.395]}>
      <mesh geometry={nodes.Plane001.geometry}>
        <meshPhysicalMaterial map={texture}/>
      </mesh> 
    </group>
  )
}

function Floor(props) {
  const floor = useGLTF("Floor.glb")
  const texture = useTexture("Floor8K.jpg")
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
  const texture = useTexture("Walls8k.jpg")

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

function ViewPos(props){
  return(
    <mesh {...props}>
      <Html scale={0.1} transform rotation={[ 0, -Math.PI/2, 0]}>
        <div data-show={props.visible} onClick={() => {props.onClick()}} className={styles.infoContainer}>
          <span>
            {props.children}
          </span>
        </div>
      </Html>
    </mesh>
  )
}

export default function HomeCanvas() {
  const { camera } = useThree();
  const [ animate, setAnimate ] = useState(false);
  const [ state, setState ] = useState(false);
  const [ view, setView ] = useState(null);
  const [ offset ] = useState(new Vector3(2, 10, 5));
  const qtd = useRef(0);
  const cam = {
    apartment: {position: new Vector3(-5.5, 1.3, 5), look: new Vector3(2, 0.8, 5), velocity: 0.02, time: 1500},
    room: {position: new Vector3(1.5, 1.3, 7.5), look: new Vector3(2, 1.3, 1), velocity: 0.002, time: 1500},
    corridor: {position: new Vector3(3.5, 1.3, 3.5), look: new Vector3(3.5, 1.3, 1), velocity: 0.002, time: 2000},
  }

  useEffect(() => {
    if (view == null) {
      setTimeout(() => {
        console.log(camera.position)
        setView("apartment")
      }, 7000)
    }
  }, [view]) 

  useFrame(() => {
    if (view == null) {
      return
    }

    // console.log(camera.position)
    // console.log(cam[view]?.position)
    // console.log(camera.position.distanceTo(cam[view]?.position))

    if (camera.position.distanceTo(cam[view].position) > 1.201) {
      console.log("test")
      setTimeout(() => {
        qtd.current += 0.00005; 
        camera.position.z = MathUtils.lerp(camera.position.z, cam[view].position.z, qtd.current);;
      }, cam[view].time)
  
      offset.z = MathUtils.lerp(offset.z, cam[view].look.z, 0.01)
      offset.y = MathUtils.lerp(offset.y, cam[view].look.y, 0.02)
      offset.x = MathUtils.lerp(offset.x, cam[view].look.x, 0.02)

      camera.lookAt(offset)
  
      camera.position.x = MathUtils.lerp(camera.position.x, cam[view].position.x, MathUtils.smootherstep(camera.position.x, -5.5, 1) * 0.03 + cam[view].velocity)
    }
  });

  return (
    <>
      <Stats/>
      <Rays/>

      <ViewPos onClick={() => {setView("room"); qtd.current=0}} visible={view == "apartment"} position={[-0.5, 1.4, 5]}> 
        Apartment view
      </ViewPos>

      <ViewPos onClick={() => {setView("corridor"); qtd.current=0}} visible={view == "room"} rotation={[0, Math.PI/2, 0]} position={[3.5, 1.4, 2]}> 
        Rooms
      </ViewPos>

      <ViewPos onClick={() => {setView("Bedroom"); qtd.current=0}} visible={view == "corridor"} rotation={[0, 0, 0]} position={[3, 1.4, 1.5]}> 
        Bedroom
      </ViewPos>

      <ambientLight intensity={2}/>

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