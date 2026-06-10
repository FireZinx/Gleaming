"use client"

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect, JSX } from "react"
import { ShadersTexture } from "../shaders/shaders"

type WallsProps = JSX.IntrinsicElements["group"] & {
  customWallRef: React.RefObject<THREE.ShaderMaterial | null>;
}

export default function Walls(props: WallsProps) {
  const { nodes } = useGLTF("untitled.glb")
  const texture = useLoader(THREE.TextureLoader, "Walls.jpg")
  //const textureShadow = useLoader(THREE.TextureLoader, "WallsShadow.jpg")

  //customWallRef

  texture.flipY = false
  //textureShadow.flipY = false

  useEffect(() => {
    if (props.customWallRef.current != null && props.customWallRef.current.uniforms.ftexture.value == null) {
      props.customWallRef.current.uniforms.ftexture.value = texture;
      //props.customWallRef.current.uniforms.stexture.value = textureShadow;
    }
  },[texture, /*textureShadow,*/ props.customWallRef])
  
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