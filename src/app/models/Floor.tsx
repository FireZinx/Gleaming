"use client"

import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { useEffect, JSX } from "react"
import { ShadersTexture } from "../shaders/shaders"
import { useGLTF, MeshReflectorMaterial } from '@react-three/drei'
import { DoubleSide } from "three";

type FloorProps = JSX.IntrinsicElements["group"] & {
  customFloorRef: React.RefObject<THREE.ShaderMaterial | null>;
};

export default function Floor(props: FloorProps) {
  const floor = useGLTF("Floor.glb");
  const texture = useLoader(THREE.TextureLoader, "Floor.jpg")
  //const textureShadow = useLoader(THREE.TextureLoader, "FloorShadows.jpg")

  texture.flipY = false
  //textureShadow.flipY = false
  
   useEffect(() => {
      if (props.customFloorRef.current != null && props.customFloorRef.current.uniforms.ftexture.value == null) {
        props.customFloorRef.current.uniforms.ftexture.value = texture;
        //props.customFloorRef.current.uniforms.stexture.value = textureShadow;
      }
  }, [texture, /*textureShadow*/ props.customFloorRef])
  
  return (
    <group {...props} position={[0.012, 0.1954, 0.005]} scale={1.4} rotation={[Math.PI/2, Math.PI, Math.PI]}>
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