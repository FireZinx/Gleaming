"use client"

import * as THREE from 'three'
import { useGLTF,  MeshTransmissionMaterial} from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { DoubleSide } from "three";


export default function Windows() {
  const Window = useGLTF("Window.glb") as any;
  const Glass = useGLTF("glass.glb") as any;
  const glassLightmap = useLoader(THREE.TextureLoader, "glass.jpg")
  const texture = useLoader(THREE.TextureLoader, "Window.jpg")

  texture.flipY = false
  texture.channel = 0

  glassLightmap.flipY = false
  glassLightmap.channel = 1

  return(
    <group dispose={null}>
      <group position={[0, 0.01, 0]} scale={[1.4, 1.4, 1.4]}>
        <mesh  geometry={Window.nodes.Cube007.geometry}>
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