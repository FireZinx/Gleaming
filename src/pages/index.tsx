import Head from "next/head";
import Image from "next/image";
import { Inter, Vampiro_One } from "next/font/google";
import styles from "../styles/Home.module.css";
import { useFrame, useLoader, useGraph, useThree, extend} from '@react-three/fiber'
import { SoftShadows, Environment, Reflector, useGLTF, RandomizedLight, SpotLight, Stats, useTexture, Lightformer, MeshTransmissionMaterial, MeshReflectorMaterial, useProgress, Html} from '@react-three/drei'
import { useEffect, Suspense, useRef, useState, forwardRef, use, useContext, useMemo} from "react"
import { Vector3, Camera, WebGLCubeRenderTarget, DoubleSide, MathUtils, PerspectiveCamera, FrontSide, CatmullRomCurve3} from "three";
import {Bloom, EffectComposer, GodRays, SMAA} from "@react-three/postprocessing";
import {KernelSize, Pass, Resolution} from "postprocessing" 
import { ButtonContext } from "../components/DataContext";

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
          <MeshTransmissionMaterial thickness={0.01}  resolution={1024} ior={1.25} roughness={0.09} transmission={0.95} clearcoat={1} clearcoatRoughness={0} transparent={false}/>
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
    <group {...props} ref={props.pos} scale={1.4}>
      <mesh geometry={nodes.Plane001.geometry}>
        <meshPhysicalMaterial map={texture}/>
      </mesh> 
    </group>
  )
}

function Floor(props) {
  const floor = useGLTF("Floor.glb")
  let texture

  if (props.ios) {
    texture = useTexture("Floor.jpg")
  }else {
    texture = useTexture("Floor8k.jpg")
  }

  texture.flipY = false
  texture.channel = 1

  return (
    <group {...props} position={[0, 0.01, 0]} scale={1.4} rotation={[Math.PI/2, Math.PI, Math.PI]}>
      <mesh geometry={floor.nodes.Plane003.geometry}>
        <MeshReflectorMaterial
          side={DoubleSide}
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
  let texture

  if (props.ios) {
    texture = useTexture("Walls.jpg")
  }else {
    texture = useTexture("Walls8k.jpg")
  }

  texture.flipY = false
  texture.channel = 1

  return (
    <>
      <group {...props} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={nodes.Plane002.geometry} >
          <meshPhysicalMaterial side={DoubleSide} map={texture} roughness={0.95}/>
        </mesh>
      </group>
    </>
  )
}

function Furniture(props) {
  const sofa = useGLTF("Sofa.glb")
  const outdoorcouch = useGLTF("outdoorCouch.glb")
  const chair = useGLTF("Chair.glb")
  const table = useGLTF("Table.glb")
  const kitchen = useGLTF("kitchen.glb")
  const fridge = useGLTF("Fridge.glb")
  const tvstand = useGLTF("tvstand.glb")
  const fence = useGLTF("Fence.glb")
  const woodWall = useGLTF("WoodWall.glb")
  const frame = useGLTF("Frame.glb")
  const light = useGLTF("Lights.glb")
  const plant = useGLTF("Plants.glb")

  const chair_map = useTexture("Chair.jpg")
  const sofa_map = useTexture("Sofa.jpg")
  const outdoorcouch_map = useTexture("outdoorCouch.jpg")
  const table_map = useTexture("Table.jpg")
  const kitchen_map = useTexture("kitchen.jpg")
  const fridge_map = useTexture("Fridge.jpg")
  const tvstand_map = useTexture("TvStand.jpg")
  const fence_map = useTexture("Fence.jpg")
  const woodWall_map = useTexture("WoodWall.jpg")
  const frame_map = useTexture("Frame.jpg")
  const light_map = useTexture("Light.jpg")
  const plant_map = useTexture("Plants.jpg")

  sofa_map.flipY = false
  sofa_map.channel = 1
  outdoorcouch_map.flipY = false
  outdoorcouch_map.channel = 1
  chair_map.flipY = false
  chair_map.channel = 1
  table_map.flipY = false
  table_map.channel = 1
  kitchen_map.flipY = false
  kitchen_map.channel = 1
  fridge_map.flipY = false
  fridge_map.channel = 1
  tvstand_map.flipY = false
  tvstand_map.channel = 1
  fence_map.flipY = false
  fence_map.channel = 1
  woodWall_map.flipY = false
  woodWall_map.channel = 1
  frame_map.flipY = false
  frame_map.channel = 1
  light_map.flipY = false
  light_map.channel = 1
  plant_map.flipY = false
  plant_map.channel = 1

  return(
    <>
      <group scale={[1.225, 1.3, 1.5]} position={[1.375, 0.7, 2.875]}>
        <mesh geometry={sofa.nodes.under_part.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={sofa_map}/>       
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={outdoorcouch.nodes.couch.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={outdoorcouch_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={chair.nodes.Leme_chair002.geometry}>
          <meshPhysicalMaterial map={chair_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={table.nodes.Table.geometry}>
          <meshPhysicalMaterial map={table_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={kitchen.nodes.kitchen.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={kitchen_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={fridge.nodes.Circle.geometry}>
          <meshPhysicalMaterial map={fridge_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} rotation={[0, 0, Math.PI / 2]} scale={1.4}>
        <mesh geometry={tvstand.nodes.Cube010.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={tvstand_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={fence.nodes.Cube011.geometry}>
          <meshPhysicalMaterial map={fence_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={woodWall.nodes.Plane005.geometry}>
          <meshPhysicalMaterial map={woodWall_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={frame.nodes.Buffet_bazalt001.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={frame_map}/>
        </mesh>
      </group>
      <group {...props} position={[0, 0.1225, 0]} dispose={null} scale={1.4}>
        <mesh geometry={light.nodes.Cube009.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={light_map}/>
        </mesh>
      </group>
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={plant.nodes.Plane.geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={plant_map}/>
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
          <SMAA />
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
          <img style={{transform: `rotate(${props.degress}deg)`}} src="Enter.png"  data-show={props.visible} className={styles.image}/>
        </div>
      </Html>
    </mesh>
  )
}

const cam = {
  dimension: {position: new Vector3(3.5, 12, 3.8), look: new Vector3(3.5, 0, 3.7), velocity: 0.4},
  apartment: {position: new Vector3(-5.5, 2.2, 5), look: new Vector3(10, 0.8, 5), velocity: 0.4},
  room: {position: new Vector3(5.5, 2.2, 7.25), look: new Vector3(0, 1.1, 1), velocity: 0.4},
  kitchen:{position:new Vector3(4, 2.2, 6.5), look: new Vector3(0, 1.3, 9), velocity: 0.4},
  corridor: {position: new Vector3(3.2, 2.2, 2.8), look: new Vector3(3.5, 1.3, -2), velocity: 0.4},
  bedroom: {position: new Vector3(1, 2.2, 1.3), look: new Vector3(-2, 1.3, -1), velocity: 0.4},
  masterbedroom: {position: new Vector3(6.5, 2.2, 0.3), look: new Vector3(8, 1.3, 2), velocity: 0.4},
  bathroom: {position: new Vector3(2.8, 2.2, -1.5), look: new Vector3(5, 1.3, 0), velocity: 0.4}
}

const cam2 = {
  apartment: {
    curve: new CatmullRomCurve3([
      new Vector3(-10, 2.3, 5),
      new Vector3(-5.5, 2.2, 5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(-10, 10, 5),
      new Vector3(10, 0.8, 5)
    ]),
    velocity: 0.2
  },
  room: {
    curve: new CatmullRomCurve3([
      new Vector3(-5.5, 2.2, 5),
      new Vector3(2, 2.2, 5.5),
      new Vector3(5.5, 2.2, 7.25)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(10, 0.8, 5),
      new Vector3(0, 1.1, 1),
    ]),
    velocity: 0.2
  }
}

const camRoutes = {
  apartment: {
    previousPos: "apartment",
    nextPos: ["room"]
  },
  room: {
    previousPos: "apartment",
    nextPos: ["kitchen", "corridor"]
  },
  kitchen: {
    previousPos: "room",
    nextPos: []
  },
  corridor: {
    previousPos: "room",
    nextPos: ["bedroom", "masterbedroom", "bathroom"]
  },
  bedroom: {
    previousPos: "corridor",
    nextPos: []
  },
  masterbedroom: {
    previousPos: "corridor",
    nextPos: []
  },
  bathroom: {
    previousPos: "corridor",
    nextPos: []
  }
}

export default function HomeCanvas() {
  const [ios, _] = useState(!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent));
  const { camera } = useThree();
  const [ view, setView ] = useState(null);
  const [ viewMode, setViewMode ] = useState(false)
  const [ offset ] = useState(new Vector3(2, 10, 5));

  const roofDisplacement = useRef(0);
  const interpolation = useRef(0);
  const animateRoof = useRef(0);
  const animate = useRef(false);

  const sceneContext = useContext(ButtonContext);

  useEffect(() => {
    if (sceneContext.view == null) {
      setTimeout(() => {
        sceneContext.setView("apartment");
        sceneContext.setPreviousView("apartment");
      }, 7000)
    }

    if (sceneContext.returning.current) {
      sceneContext.setReturning(false);
    } else {
      animate.current = true;
    }

    console.log("View inside index", sceneContext.view);
  }, [sceneContext.view]) 

  useFrame((state, delta) => {
    if (sceneContext.view == null) {
      return
    }

    // if (view == "dimension" ) {
    //   interpolation.current += delta * 0.4;
      
    //   if (interpolation.current > 1) { 
    //     interpolation.current = 1
    //   }

    //   let interpolationOffset = interpolation.current ** 2   

    //   if (viewMode) {
    //     roofDisplacement.current.position.y = MathUtils.lerp(0, 15, interpolationOffset)
    //   } else {
    //     roofDisplacement.current.position.y = MathUtils.lerp(15, 0, interpolationOffset)
    //   }
    // }

    console.log(sceneContext.returning);

    if (animate.current || sceneContext.returning.current) {
      console.log("Animating")
      interpolation.current += delta * cam2[sceneContext.view].velocity
      
      if (interpolation.current > 1) { 
        interpolation.current = 1
      }

      let interpolationOffset = MathUtils.smootherstep(interpolation.current, 0, 1)

      if (sceneContext.returning.current) {
        interpolationOffset = 1 - interpolationOffset;
      }

      let dest = cam2[sceneContext.view].curve.getPointAt(interpolationOffset)
      let lookAtDest = cam2[sceneContext.view].look.getPointAt(interpolationOffset);

      camera.position.set(dest.x, dest.y, dest.z)
      camera.lookAt(lookAtDest)

      if (interpolation.current == 1) {
        interpolation.current = 0;

        if (sceneContext.returning.current) {
          sceneContext.setView(camRoutes[sceneContext.view].previousPos)
        }

        animate.current = false;
      }
    }
  });

  return (
    <>
      <Stats/>
      <Rays/>

      <ViewPos onClick={() => {sceneContext.setView("room"); sceneContext.setPreviousView("apartment");}} visible={sceneContext.view == "apartment"}  position={[-0.5, 1.3, 5]}> 
        Apartment view
      </ViewPos>

      <ViewPos onClick={() => {sceneContext.setView("corridor"); sceneContext.setPreviousView("room");}} visible={sceneContext.view == "room"}  rotation={[0, Math.PI/2, 0]} position={[3.2, 1, 1.8]}> 
        Rooms
      </ViewPos>

      <ViewPos onClick={() => {sceneContext.setView("kitchen"); sceneContext.setPreviousView("room");}} visible={sceneContext.view == "room"} degress={180} rotation={[0, Math.PI * 0.8, 0]} position={[3.2, 1, 5.5]}> 
        Kitchen
      </ViewPos>

      <ViewPos onClick={() => {sceneContext.setView("bedroom"); sceneContext.setPreviousView("corridor");}} visible={sceneContext.view == "corridor"} degress={270} rotation={[0, 5*Math.PI/6, 0]} position={[2.4, 1.3, 0.8]}> 
        Bedroom
      </ViewPos>

      <ViewPos onClick={() => {sceneContext.setView("masterbedroom"); sceneContext.setPreviousView("corridor");}} visible={sceneContext.view == "corridor"} degress={270} rotation={[0, Math.PI/4, 0]} position={[4.3, 1.55, 0.7]}> 
        Master Bedroom
      </ViewPos>

      <ViewPos onClick={() => {sceneContext.setView("bathroom"); sceneContext.setPreviousView("corridor");}} visible={sceneContext.view == "corridor"} rotation={[0, Math.PI/2, 0]} position={[3.25, 1.3, 0.3]}> 
        Bathroom
      </ViewPos>

      <ambientLight intensity={2}/>

      <Suspense fallback={null}>
        <Roof pos={roofDisplacement}/>
        <Floor ios={ios}/>
        <Walls ios={ios}/>
        <Windows />
        <Furniture />
        <Sky/>
      </Suspense>
    </>
  );
}