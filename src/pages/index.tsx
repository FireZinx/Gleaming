import styles from "../styles/Home.module.css";
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF, RandomizedLight, Stats, useTexture, MeshTransmissionMaterial, MeshReflectorMaterial, Html, AccumulativeShadows} from '@react-three/drei'
import { useEffect, Suspense, useRef, useState, forwardRef, useContext } from "react"
import { Vector3, DoubleSide, MathUtils, PerspectiveCamera, CatmullRomCurve3, Vector4 } from "three";
import { Bloom, EffectComposer, GodRays, SMAA } from "@react-three/postprocessing";
import { KernelSize, Pass, Resolution } from "postprocessing" 
import { ButtonContext } from "../components/DataContext";
import { ShadersTexture } from "../shaders/shaders"
import BedRoomMesh  from "../models/bedrooms"
import Carpet from"../models/carpet"
import * as THREE from 'three'



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
      <group position={[0, 0.01, -0.027]} scale={[1.4, 1.4, 1.408]}>
        <mesh  geometry={Window.nodes.Cube005.geometry}>
          <meshPhysicalMaterial map={texture} side={DoubleSide}/>
        </mesh>
      </group>

      <group>
        <mesh  geometry={Glass.nodes.Plane006.geometry} position={[-0.26, 0.12, 4.024]} scale={[1.4, 1.1, 1.1]} rotation={[0, -  Math.PI/2,Math.PI / 2]}>
          <MeshTransmissionMaterial thickness={0.01}  resolution={1024} ior={1.25} roughness={0.09} transmission={0.95} clearcoat={1} clearcoatRoughness={0} transparent={false}/>
        </mesh>
      </group>
    </group>
  )
}

function Roof(props){
  const {nodes, materials} = useGLTF("Roof.glb")
  const texture = useTexture("Roof.jpg")

  texture.flipY = false
  texture.channel = 1

  return(
    <group {...props} ref={props.pos} scale={1.4}>
      <mesh geometry={nodes.Plane010.geometry}>
        <meshPhysicalMaterial map={texture}/>
      </mesh> 
    </group>
  )
}

function Floor(props) {
  const floor = useGLTF("Floor.glb");
  const floor_text = new THREE.TextureLoader().load("Floor.jpg");
  const shadow_floor_text = new THREE.TextureLoader().load("FloorShadows.jpg");

  floor_text.flipY = false;
  floor_text.channel = 1;
  shadow_floor_text.flipY = false;
  shadow_floor_text.channel = 1;
  
  if (props.customFloorRef.current != null && props.customFloorRef.current.uniforms.ftexture.value == null) {
    props.customFloorRef.current.uniforms.ftexture.value = floor_text;
    props.customFloorRef.current.uniforms.stexture.value = shadow_floor_text;
  }
  
  return (
    <group {...props} position={[0, 0.1954, 0]} scale={1.4} rotation={[Math.PI/2, Math.PI, Math.PI]}>
      <mesh geometry={floor.nodes.Plane003.geometry}>
        <ShadersTexture ref={props.customFloorRef} />
      </mesh>

      <mesh position={[0, 0, 0.00005]} geometry={floor.nodes.Plane003.geometry}>
        <MeshReflectorMaterial
          side={DoubleSide}
          blur={[1600, 800]}
          resolution={512}
          mirror={1}
          mixBlur={0.8}
          mixStrength={1}
          transparent={true}
          opacity={0.2}
          color={[0.5, 0.5, 0.5]}
        />
      </mesh>
    </group>
  )
}

function Walls(props) {
  const { nodes } = useGLTF("untitled.glb")
  const texture = new THREE.TextureLoader().load("Walls.jpg")
  const shadow_texture = new THREE.TextureLoader().load("WallsShadow.jpg")

  //customWallRef

  texture.flipY = false
  texture.channel = 1

  shadow_texture.flipY = false
  shadow_texture.channel = 1

  if (props.customWallRef.current != null && props.customWallRef.current.uniforms.ftexture.value == null) {
    props.customWallRef.current.uniforms.ftexture.value = texture;
    props.customWallRef.current.uniforms.stexture.value = shadow_texture;
  }

  return (
    <>
      <group {...props} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={nodes.Plane002.geometry} >
          <ShadersTexture ref={props.customWallRef} />
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
      <group scale={[1.225, 1.3, 1.5]}>
        <mesh geometry={sofa.nodes.under_part003.geometry} scale={[1.15, 1.08, 0.97]} position={[0, 0, -0.16]}>
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
      <group {...props} dispose={null} scale={1.4}>
        <mesh geometry={tvstand.nodes.Cube001.geometry}>
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
      <group {...props} position={[0, -0.005, 0]} dispose={null} scale={1.4}>
        <mesh geometry={light.nodes.Lights002.geometry}>
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

export default function HomeCanvas(props) {
  const [ios, _] = useState(!window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent));
  const { camera } = useThree();
  const [ view, setView ] = useState(null);
  const [ viewMode, setViewMode ] = useState(false);

  const roofDisplacement = useRef(0);
  const interpolation = useRef(0);
  const normalizedX = useRef(0);;
  const linearX = useRef(0);
  const count = useRef(0);
  const animate = useRef(false);
  const floorShadersRef = useRef(null);
  const wallShadersRef = useRef(null);
  
  const sceneContext = useContext(ButtonContext);

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      //linear scaling 
      if (sceneContext.view == null) {
        return
      }
  
        normalizedX.current = (6 * event.clientX) / window.innerWidth - 3
    })

    if (sceneContext.view == null ) {
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
  }, [sceneContext.view]) 

  useFrame(( state, delta ) => {
    if (sceneContext.view == null) {
      return
    }

    if (floorShadersRef != null && wallShadersRef != null) {
      floorShadersRef.current.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
      wallShadersRef.current.uniforms.time.value = Math.sin(state.clock.elapsedTime * 0.5) * 30
    }

    if (animate.current || sceneContext.returning.current) {
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
      linearX.current = 0

      if (interpolation.current == 1) {
        interpolation.current = 0;

        if (sceneContext.returning.current) {
          sceneContext.setView(camRoutes[sceneContext.view].previousPos)
        }

        animate.current = false;
      }
    } else {
      const resultX = normalizedX.current - linearX.current
      const QN = new THREE.Quaternion(0, -resultX, 0, 20)
      camera.applyQuaternion(QN)
      camera.quaternion.normalize()
      linearX.current = normalizedX.current
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

      <ambientLight intensity={3}/>

      <AccumulativeShadows resolution={1024} frames={100} color={"black"} alphaTest={0.68} colorBlend={1.5} opacity={1.65} scale={8}>
        <RandomizedLight radius={1.5} ambient={0.7} position={[-20, 4, 0]} bias={0.001} />
      </AccumulativeShadows>

      <Suspense fallback={null}>
        <Roof pos={roofDisplacement}/>
        <Floor customFloorRef={floorShadersRef} />
        <Walls customWallRef={wallShadersRef} ios={"true"}/>
        <Windows />
        <Furniture />

        <BedRoomMesh />
        <Carpet />

        <Sky/>
      </Suspense>
    </>
  );
}