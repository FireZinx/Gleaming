"use client"

import styles from "../page.module.css"
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { useGLTF, RandomizedLight, Stats, useTexture, MeshTransmissionMaterial, MeshReflectorMaterial, Html, AccumulativeShadows} from '@react-three/drei'
import { useEffect, Suspense, useRef, useState, forwardRef, useContext, MutableRefObject, JSX } from "react"
import { Vector3, DoubleSide, MathUtils, CatmullRomCurve3 } from "three";
import { Bloom, EffectComposer, GodRays, SMAA } from "@react-three/postprocessing";
import { KernelSize, Pass, Resolution } from "postprocessing" 
import { ButtonContext } from "../components/DataContext";
import { ShadersTexture } from "../shaders/shaders"
import BedRoomMesh  from "../models/bedrooms"
import Carpet from"../models/carpet"
import * as THREE from 'three'

function Windows() {
  const Window = useGLTF("Window.glb")
  const Glass = useGLTF("glass.glb")
  const glassLightmap = useTexture("glass.jpg")
  const texture = useTexture("Window.jpg")

  texture.flipY = false
  texture.channel = 1

  glassLightmap.flipY = false
  glassLightmap.channel = 1

  return(
    <group dispose={null}>
      <group position={[0, 0.01, -0.027]} scale={[1.4, 1.4, 1.408]}>
        <mesh  geometry={(Window.nodes.Cube005 as THREE.Mesh).geometry}>
          <meshPhysicalMaterial map={texture} side={DoubleSide}/>
        </mesh>
      </group>

      <group>
        <mesh  geometry={(Glass.nodes.Plane006 as THREE.Mesh).geometry} position={[-0.26, 0.12, 4.024]} scale={[1.4, 1.1, 1.1]} rotation={[0, -  Math.PI/2,Math.PI / 2]}>
          <MeshTransmissionMaterial thickness={0.01}  resolution={1024} ior={1.25} roughness={0.09} transmission={0.95} clearcoat={1} clearcoatRoughness={0} transparent={false}/>
        </mesh>
      </group>
    </group>
  )
}

type RoofProps = JSX.IntrinsicElements["group"] & {
  customRoofRef: React.RefObject<THREE.ShaderMaterial | null>;
  pos?: React.Ref<THREE.Group>;
};

function Roof(props: RoofProps){
  const roof = useGLTF("Roof.glb");
  const texture = useLoader(THREE.TextureLoader, "Roof.jpg")
  const textureShadow = useLoader(THREE.TextureLoader, "RoofShadow.jpg")

  texture.flipY = false
  textureShadow.flipY = false

  useEffect(() => {
    if (props.customRoofRef.current != null && props.customRoofRef.current.uniforms.ftexture.value == null) {
      props.customRoofRef.current.uniforms.ftexture.value = texture;
      props.customRoofRef.current.uniforms.stexture.value = textureShadow;
    }
  }, [texture, textureShadow, props.customRoofRef])

  return(
    <group {...props} ref={props.pos} scale={1.4}>
      <mesh geometry={(roof.nodes.Plane010 as THREE.Mesh).geometry}>
        <ShadersTexture ref={props.customRoofRef} />
      </mesh> 
    </group>
  )
}

type FloorProps = JSX.IntrinsicElements["group"] & {
  customFloorRef: React.RefObject<THREE.ShaderMaterial | null>;
};

function Floor(props: FloorProps) {
  const floor = useGLTF("Floor.glb");
  const texture = useLoader(THREE.TextureLoader, "Floor.jpg")
  const textureShadow = useLoader(THREE.TextureLoader, "FloorShadows.jpg")

  texture.flipY = false
  textureShadow.flipY = false
  
   useEffect(() => {
      if (props.customFloorRef.current != null && props.customFloorRef.current.uniforms.ftexture.value == null) {
        props.customFloorRef.current.uniforms.ftexture.value = texture;
        props.customFloorRef.current.uniforms.stexture.value = textureShadow;
      }
  }, [texture, textureShadow, props.customFloorRef])
  
  return (
    <group {...props} position={[0, 0.1954, 0]} scale={1.4} rotation={[Math.PI/2, Math.PI, Math.PI]}>
      <mesh geometry={(floor.nodes.Plane003 as THREE.Mesh).geometry}>
        <ShadersTexture ref={props.customFloorRef} />
      </mesh>

      <mesh position={[0, 0, 0.00005]} geometry={(floor.nodes.Plane003 as THREE.Mesh).geometry}>
        <MeshReflectorMaterial
          side={DoubleSide}
          blur={[1600, 800]}
          resolution={512}
          mirror={1}
          mixBlur={0.8}
          mixStrength={0.5}
          transparent={true}
          opacity={0.2}
          color={[0.1, 0.1, 0.1]}
        />
      </mesh>
    </group>
  )
}

type WallsProps = JSX.IntrinsicElements["group"] & {
  customWallRef: React.RefObject<THREE.ShaderMaterial | null>;
}

function Walls(props: WallsProps) {
  const { nodes } = useGLTF("untitled.glb")
  const texture = useLoader(THREE.TextureLoader, "Walls.jpg")
  const textureShadow = useLoader(THREE.TextureLoader, "WallsShadow.jpg")

  //customWallRef

  texture.flipY = false
  textureShadow.flipY = false

  useEffect(() => {
    if (props.customWallRef.current != null && props.customWallRef.current.uniforms.ftexture.value == null) {
      props.customWallRef.current.uniforms.ftexture.value = texture;
      props.customWallRef.current.uniforms.stexture.value = textureShadow;
    }
  },[texture, textureShadow, props.customWallRef])
  
  return (
    <>
      <group {...props} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={(nodes.Plane002 as THREE.Mesh).geometry} >
          <ShadersTexture ref={props.customWallRef} />
        </mesh>
      </group>
    </>
  )
}

type RoomProps = JSX.IntrinsicElements["group"] &  {
  customTableRef: React.RefObject<THREE.ShaderMaterial | null>;
  customSofaRef: React.RefObject<THREE.ShaderMaterial | null>;
  customChairRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvStandRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvWoodWallRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvFrameRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvLightRef: React.RefObject<THREE.ShaderMaterial | null>;
}

function Room(props: RoomProps) {
  const sofa = useGLTF("Sofa.glb")
  const chair = useGLTF("Chair.glb")
  const table = useGLTF("Table.glb")
  const tvStand = useGLTF("tvstand.glb")
  const woodWall = useGLTF("woodWall.glb")
  const frame = useGLTF("Frame.glb")
  const light = useGLTF("Lights.glb")
  
  const sofaTexture = useLoader(THREE.TextureLoader, "Sofa.jpg")
  const chairTexture = useLoader(THREE.TextureLoader, "Chair.jpg")
  const tableTexture = useLoader(THREE.TextureLoader, "Table.jpg")
  const tvStandTexture = useLoader(THREE.TextureLoader, "TvStand.jpg")
  const woodWallTexture = useLoader(THREE.TextureLoader, "WoodWall.jpg")
  const frameTexture = useLoader(THREE.TextureLoader, "Frame.jpg")
  const lightTexture = useLoader(THREE.TextureLoader, "Light.jpg")

  const sofaTextureShadow = useLoader(THREE.TextureLoader, "sofaShadow.jpg")
  const chairTextureShadow = useLoader(THREE.TextureLoader, "ChairShadow.jpg")
  const tableTextureShadow = useLoader(THREE.TextureLoader, "TableShadow.png")
  const tvStandTextureShadow = useLoader(THREE.TextureLoader, "TvStandShadow.jpg")
  const woodWallTextureShadow = useLoader(THREE.TextureLoader, "WoodWallShadow.jpg")
  const frameTextureShadow = useLoader(THREE.TextureLoader, "FrameShadow.jpg")
  const lightTextureShadow = useLoader(THREE.TextureLoader, "LightShadow.jpg")

  sofaTexture.flipY = false
  chairTexture.flipY = false
  tableTexture.flipY = false
  tvStandTexture.flipY = false
  woodWallTexture.flipY = false
  frameTexture.flipY = false
  lightTexture.flipY = false
  sofaTextureShadow.flipY = false
  chairTextureShadow.flipY = false
  tableTextureShadow.flipY = false
  tvStandTextureShadow.flipY = false
  woodWallTextureShadow.flipY = false
  frameTextureShadow.flipY = false
  lightTextureShadow.flipY = false

  useEffect(() => {
    if (!props.customTableRef.current) return;
    if (!props.customSofaRef.current) return;
    if (!props.customChairRef.current) return;
    if (!props.customtvStandRef.current) return;
    if (!props.customtvWoodWallRef.current) return;
    if (!props.customtvFrameRef.current) return;
    if (!props.customtvLightRef.current) return;

    props.customTableRef.current.uniforms.ftexture.value = tableTexture;
    props.customTableRef.current.uniforms.stexture.value = tableTextureShadow;

    props.customSofaRef.current.uniforms.ftexture.value = sofaTexture;
    props.customSofaRef.current.uniforms.stexture.value = sofaTextureShadow;

    props.customChairRef.current.uniforms.ftexture.value = chairTexture;
    props.customChairRef.current.uniforms.stexture.value = chairTextureShadow;
    
    props.customtvStandRef.current.uniforms.ftexture.value = tvStandTexture;
    props.customtvStandRef.current.uniforms.stexture.value = tvStandTextureShadow;
    
    props.customtvWoodWallRef.current.uniforms.ftexture.value = woodWallTexture;
    props.customtvWoodWallRef.current.uniforms.stexture.value = woodWallTextureShadow;
    
    props.customtvFrameRef.current.uniforms.ftexture.value = frameTexture;
    props.customtvFrameRef.current.uniforms.stexture.value = frameTextureShadow;

    props.customtvLightRef.current.uniforms.ftexture.value = lightTexture;
    props.customtvLightRef.current.uniforms.stexture.value = lightTextureShadow;
    
  }, [sofaTexture, sofaTextureShadow, chairTexture, chairTextureShadow, tableTexture, tableTextureShadow, tvStandTexture, tvStandTextureShadow, woodWallTexture, woodWallTextureShadow, frameTexture, frameTextureShadow, lightTexture, lightTextureShadow, props.customTableRef, props.customSofaRef, props.customChairRef, props.customtvStandRef, props.customtvWoodWallRef, props.customtvFrameRef, props.customtvLightRef])

  return (
    <>
      <group scale={[1.225, 1.3, 1.5]}>
        <mesh geometry={(sofa.nodes.under_part003 as THREE.Mesh).geometry} scale={[1.15, 1.08, 0.97]} position={[0, 0, -0.16]}>
          <ShadersTexture ref={props.customSofaRef} />   
        </mesh>
      </group>

      <group {...props} dispose={null} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={(chair.nodes.Leme_chair001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customChairRef} />
        </mesh>

        <mesh geometry={(table.nodes.Table001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customTableRef} />
        </mesh>

        <mesh geometry={(tvStand.nodes.Cube001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvStandRef} />
        </mesh>

        <mesh geometry={(woodWall.nodes.Plane005 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvWoodWallRef} />
        </mesh>

        <mesh geometry={(frame.nodes.Buffet_bazalt002 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvFrameRef} />
        </mesh>

         <mesh geometry={(light.nodes.Lights002 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvLightRef} />
        </mesh>
      </group>
    </>
  )
}

type kitchenProps = JSX.IntrinsicElements["group"] & {
  customKitchenRef: React.RefObject<THREE.ShaderMaterial>;
  customFridgeRef: React.RefObject<THREE.ShaderMaterial>;
}

function Kitchen(props: kitchenProps) {
  const kitchen = useGLTF("kitchen.glb");
  const fridge = useGLTF("Fridge.glb");

  const kitchenTexture = useLoader(THREE.TextureLoader,"kitchen.jpg")
  const fridgeTexture =  useLoader(THREE.TextureLoader,"Fridge.jpg")
  const kitchenTextureShadow =  useLoader(THREE.TextureLoader,"KitchenShadow.jpg")
  const fridgeTextureShadow =  useLoader(THREE.TextureLoader,"FridgeShadow.jpg")

  kitchenTexture.flipY = false
  fridgeTexture.flipY = false
  kitchenTextureShadow.flipY = false
  fridgeTextureShadow.flipY = false

  return (
    <>
      <group scale={1.4}>
        <mesh geometry={(kitchen.nodes.kitchen001 as THREE.Mesh).geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={kitchenTexture}/>
        </mesh>

        <mesh geometry={(fridge.nodes.Circle001 as THREE.Mesh).geometry}>
          <meshPhysicalMaterial map={fridgeTexture}/>
        </mesh>
      </group>
    </>
  )
}

function Balcony() {
  const outdoorCouch = useGLTF("outdoorCouch.glb");
  const fence = useGLTF("Fence.glb");
  const plant = useGLTF("plants.glb");

  const outdoorCouchTexture = useTexture("outdoorCouch.jpg");
  const fenceTexture = useTexture("Fence.jpg");
  const plantTexture = useTexture("Plants.jpg");

  outdoorCouchTexture.flipY = false
  outdoorCouchTexture.channel = 1
  fenceTexture.flipY = false
  fenceTexture.channel = 1
  plantTexture.flipY = false
  plantTexture.channel = 1

  return (
    <>
      <group scale={1.4}>
        <mesh geometry={(outdoorCouch.nodes.couch as THREE.Mesh).geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={outdoorCouchTexture}/>
        </mesh>

        <mesh geometry={(fence.nodes.Cube011 as THREE.Mesh).geometry}>
          <meshPhysicalMaterial map={fenceTexture}/>
        </mesh>

        <mesh geometry={(plant.nodes.Plane as THREE.Mesh).geometry}>
          <meshPhysicalMaterial side={DoubleSide} map={plantTexture}/>
        </mesh>
      </group>
    </>
  )
}

function Sky() {
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

type ViewPosProps = JSX.IntrinsicElements["group"] & {
  visible?: boolean;
  onClick: () => void;
  degress?: number;
}

function ViewPos(props: ViewPosProps){
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
  },
  kitchen: {
    curve: new CatmullRomCurve3([
      new Vector3(5.5, 2.2, 7.25),
      new Vector3(5, 2.2, 6.8 ),
      new Vector3(4, 2.2, 6.5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(0, 1.1, 1),
      new Vector3(0, 1.3, 9),
    ]),
    velocity: 0.4
  },
  corridor: {
    curve: new CatmullRomCurve3([
      new Vector3(5.5, 2.2, 7.25),
      new Vector3(4, 2.2, 4.5 ),
      new Vector3(3.2, 2.2, 2.8)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(0, 1.1, 1),
      new Vector3(3.5, 1.3, -2),
    ]),
    velocity: 0.25
  },
  bedroom: {
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(3, 2.2, 1.1 ),
      new Vector3(2, 2.2, 1.1),
      new Vector3(2, 2.2, 0.6)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(-1, 1.1, -1),
    ]),
    velocity: 0.25
  },
  masterbedroom: {
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(3.1, 2.2, 0.7 ),
      new Vector3(6.5, 2.2, 0.3)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(8, 1.3, 2),
    ]),
    velocity: 0.25
  },
  bathroom: {
    curve: new CatmullRomCurve3([
      new Vector3(3.2, 2.2, 2.8),
      new Vector3(2.95, 2.2, 0.7 ),
      new Vector3(2.8, 2.2, -1.5)
    ]),
    look: new CatmullRomCurve3([
      new Vector3(3.5, 1.3, -2),
      new Vector3(5, 1.3, 0),
    ]),
    velocity: 0.25
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

export default function HomeCanvas(props: React.PropsWithChildren<any>) {
  const { camera } = useThree();

  const interpolation = useRef(0);
  const normalizedX = useRef(0);;
  const linearX = useRef(0);
  const animate = useRef(false);
  const isFirstRender = useRef(false);

  const floorShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const wallShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const roofShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const tableShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const sofaShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const chairShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const tvStandShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const woodWallShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const frameShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const lightShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  
  const sceneContext = useContext(ButtonContext);

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      //linear scaling 
      if (sceneContext.view == null) {
        return
      }

      normalizedX.current = (6 * event.clientX) / window.innerWidth - 3
    })

    if (isFirstRender.current == false){
      setTimeout(() => {
          sceneContext.setView("apartment");
          sceneContext.setPreviousView("apartment");
          isFirstRender.current = true;
      }, 7000)
    }
    
    if (sceneContext.isReturning.current) {
      sceneContext.setReturning(false);
    } else {
      animate.current = true;
    }
  }, [sceneContext.view]) 

  useFrame(( state, delta ) => {
    if (sceneContext.view == null) {
      return
    }

    if (floorShadersRef != null && wallShadersRef != null) {
      setTimeout(() => {
        floorShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        wallShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        roofShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
  
        sofaShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        chairShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        tvStandShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        woodWallShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        frameShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        lightShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
        tableShadersRef.current!.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
      }, 200)
    }

    if (animate.current || sceneContext.isReturning.current) {
      if (sceneContext.view != "signup" ) {
        interpolation.current += delta * cam2[sceneContext.view as keyof typeof cam2].velocity
        
        if (interpolation.current > 1) { 
          interpolation.current = 1
        }

        let interpolationOffset = MathUtils.smootherstep(interpolation.current, 0, 1)

        if (sceneContext.isReturning.current) {
          interpolationOffset = 1 - interpolationOffset;
        }

        let dest = cam2[sceneContext.view as keyof typeof cam2].curve.getPointAt(interpolationOffset)
        let lookAtDest = cam2[sceneContext.view as keyof typeof cam2].look.getPointAt(interpolationOffset);

        camera.position.set(dest.x, dest.y, dest.z)
        camera.lookAt(lookAtDest)
        linearX.current = 0

        if (interpolation.current == 1) {
          interpolation.current = 0;

          if (sceneContext.isReturning.current) {
            sceneContext.setView(camRoutes[sceneContext.view as keyof typeof camRoutes].previousPos)
          }

          animate.current = false;
        }
      }
    } else {
      const resultX = normalizedX.current - linearX.current
      const QN = new THREE.Quaternion(0, -resultX, 0, 20)
      camera.applyQuaternion(QN)
      camera.quaternion.normalize()
      linearX.current = normalizedX.current
    }
  });

  //fecth
  useEffect(() => {
    const name = "Sulivan";
    const date = "01/01/0001";

    setTimeout(() => {
      fetch(`/test?name=${name}&date=${date}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Your data is: ", data.message);
        })
      .catch((error) => {
        console.error("Error fetching IP address: ", error);
      });
    }, 5000);
  },[]);

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

      <ambientLight intensity={3}/>

      <AccumulativeShadows resolution={1024} frames={100} color={"black"} alphaTest={0.68} colorBlend={1.5} opacity={1.65} scale={8}>
        <RandomizedLight radius={1.5} ambient={0.7} position={[-20, 4, 0]} bias={0.001} />
      </AccumulativeShadows>

      <Suspense fallback={null}>
        <Roof customRoofRef={roofShadersRef}/>
        <Floor customFloorRef={floorShadersRef} />
        <Walls customWallRef={wallShadersRef}/>
        <Windows />

        <Room 
          customSofaRef={sofaShadersRef}
          customChairRef={chairShadersRef}
          customTableRef={tableShadersRef}
          customtvStandRef={tvStandShadersRef}
          customtvWoodWallRef={woodWallShadersRef}
          customtvFrameRef={frameShadersRef}
          customtvLightRef={lightShadersRef}
        />
        
        <Balcony/>

        <BedRoomMesh />
        <Carpet /> 

        <Sky/>
      </Suspense>
    </>
  );
}