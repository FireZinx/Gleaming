"use client"

import styles from "../page.module.css"
import { useFrame, useThree } from '@react-three/fiber'
import  {RandomizedLight, Stats, Html, AccumulativeShadows } from '@react-three/drei'
import { useEffect, Suspense, useRef, useState, forwardRef, useContext, MutableRefObject, JSX } from "react"
import { Vector3, MathUtils, CatmullRomCurve3 } from "three";
import { Bloom, EffectComposer, GodRays, SMAA } from "@react-three/postprocessing";
import { KernelSize, Resolution } from "postprocessing" 
import { ButtonContext } from "../components/DataContext";
import { BedRoomMesh, Carpet, Floor, Walls, Roof, Kitchen, Room, Balcony, Windows} from "../models";
import { CamRoute } from "../camera/routes";
import * as THREE from 'three'

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
      <Html scale={0.06} transform rotation={[ 0, -Math.PI/2, 0]}>
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


export default function HomeCanvas(props: React.PropsWithChildren<any>) {
  const { camera } = useThree();

  const [ view, setView ] = useState<null | string>(null);

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
  const kitchenShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  const fridgeShadersRef = useRef<THREE.ShaderMaterial | null>(null);
  
  const sceneContext = useContext(ButtonContext);

  useEffect(() => {
    window.addEventListener("mousemove", (event) => {
      normalizedX.current = (6 * event.clientX) / window.innerWidth - 3
    })

    if (isFirstRender.current == false){
      setTimeout(() => {
          setView("apartment");
          isFirstRender.current = true;

      }, 7000)
    }
    
    if (sceneContext.isReturning.current) sceneContext.setReturning(false); else animate.current = true;

  }, [view]) 

  useEffect(() => {
    if (sceneContext.isCredentialsInterface) setView("signup"); else setView("apartment");

  }, [sceneContext.isCredentialsInterface])

  useFrame(( state, delta ) => {
    if (view == null) {
      return
    }

    /*if (floorShadersRef != null && wallShadersRef != null) {
      setTimeout(() => {
        const t = Math.sin(state.clock.getElapsedTime() * 0.5) * 30;

        floorShadersRef.current!.uniforms.time.value = t;
        wallShadersRef.current!.uniforms.time.value = t;
        roofShadersRef.current!.uniforms.time.value = t;
  
        sofaShadersRef.current!.uniforms.time.value = t;
        chairShadersRef.current!.uniforms.time.value = t;
        tvStandShadersRef.current!.uniforms.time.value = t;
        woodWallShadersRef.current!.uniforms.time.value = t;
        frameShadersRef.current!.uniforms.time.value = t;
        lightShadersRef.current!.uniforms.time.value = t;
        tableShadersRef.current!.uniforms.time.value = t;
      }, 200)
    }*/

    if (animate.current || sceneContext.isReturning.current) {
      if (view != "signup" ) {
        interpolation.current += delta * CamRoute[view as keyof typeof CamRoute].velocity

        let interpolationOffset = MathUtils.smootherstep(interpolation.current, 0, 1)

        if (sceneContext.isReturning.current) interpolationOffset = 1 - interpolationOffset;

        let dest = CamRoute[view as keyof typeof CamRoute].curve.getPointAt(interpolationOffset)
        let lookAtDest = CamRoute[view as keyof typeof CamRoute].look.getPointAt(interpolationOffset);
      
        camera.position.set(dest.x, dest.y, dest.z)
        camera.lookAt(lookAtDest)
        linearX.current = 0

        if (interpolation.current > 1) {
          interpolation.current = 0;
          
          if (sceneContext.isReturning.current) setView(CamRoute[view as keyof typeof CamRoute].previousPos);

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

  return (
    <>
      <Stats/>
      <Rays/>

      <ViewPos onClick={() => {setView("room");}} visible={view == "apartment"}  position={[-0.5, 1.3, 5]}> 
        Apartment view
      </ViewPos>

      <ViewPos onClick={() => {setView("corridor");}} visible={view == "room"}  rotation={[0, Math.PI/2, 0]} position={[3.2, 1, 1.8]}> 
        Rooms
      </ViewPos>

      <ViewPos onClick={() => {setView("kitchen");}} visible={view == "room"} degress={180} rotation={[0, Math.PI * 0.8, 0]} position={[3.2, 1, 5.5]}> 
        Kitchen
      </ViewPos>

      <ViewPos onClick={() => {setView("bedroom");}} visible={view == "corridor"} degress={270} rotation={[0, 5*Math.PI/6, 0]} position={[2.4, 1.3, 0.8]}> 
        Bedroom
      </ViewPos>

      <ViewPos onClick={() => {setView("masterbedroom");}} visible={view == "corridor"} degress={270} rotation={[0, Math.PI/4, 0]} position={[4.3, 1.55, 0.7]}> 
        Master Bedroom
      </ViewPos>

      <ViewPos onClick={() => {setView("bathroom");}} visible={view == "corridor"} rotation={[0, Math.PI/2, 0]} position={[3.25, 1.3, 0.3]}> 
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
        <Kitchen customKitchenRef={kitchenShadersRef} customFridgeRef={fridgeShadersRef} />
        <Balcony/>

        <BedRoomMesh />
        <Carpet /> 

        <color attach="background" args={["#BEDCF5"]}/>
      </Suspense>
    </>
  );
}