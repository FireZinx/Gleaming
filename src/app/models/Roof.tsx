"use client"

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect, JSX } from "react"
import { ShadersTexture } from "../shaders/shaders"

type RoofProps = JSX.IntrinsicElements["group"] & {
  customRoofRef: React.RefObject<THREE.ShaderMaterial | null>;
  pos?: React.Ref<THREE.Group>;
};

export default function Roof(props: RoofProps){
  const roof = useGLTF("Roof.glb");
  const texture = useLoader(THREE.TextureLoader, "Roof.jpg")
  //const textureShadow = useLoader(THREE.TextureLoader, "RoofShadow.jpg")

  texture.flipY = false
  //textureShadow.flipY = false

  useEffect(() => {
    if (props.customRoofRef.current != null && props.customRoofRef.current.uniforms.ftexture.value == null) {
      props.customRoofRef.current.uniforms.ftexture.value = texture;
      //props.customRoofRef.current.uniforms.stexture.value = textureShadow;
    }
  }, [texture, /*textureShadow*/ props.customRoofRef])

  return(
    <group {...props} ref={props.pos} scale={1.4}>
      <mesh geometry={(roof.nodes.Plane010 as THREE.Mesh).geometry}>
        <ShadersTexture ref={props.customRoofRef} />
      </mesh> 
    </group>
  )
}