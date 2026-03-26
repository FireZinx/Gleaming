"use client"

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { JSX } from "react"
import { DoubleSide } from "three";

type kitchenProps = JSX.IntrinsicElements["group"] & {
  customKitchenRef: React.RefObject<THREE.ShaderMaterial>;
  customFridgeRef: React.RefObject<THREE.ShaderMaterial>;
}

export default function Kitchen(props: kitchenProps) {
  const kitchen = useGLTF("kitchen.glb");
  const fridge = useGLTF("Fridge.glb");

  const kitchenTexture = useLoader(THREE.TextureLoader,"kitchen.jpg")
  const fridgeTexture =  useLoader(THREE.TextureLoader,"Fridge.jpg")
  /*const kitchenTextureShadow =  useLoader(THREE.TextureLoader,"KitchenShadow.jpg")
  const fridgeTextureShadow =  useLoader(THREE.TextureLoader,"FridgeShadow.jpg")*/

  kitchenTexture.flipY = false
  fridgeTexture.flipY = false
  /*kitchenTextureShadow.flipY = false
  fridgeTextureShadow.flipY = false*/

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
