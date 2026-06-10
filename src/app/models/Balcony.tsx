"use client"

import * as THREE from 'three'
import { useGLTF,  MeshTransmissionMaterial} from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { DoubleSide } from "three";

export default function Balcony() {
  const outdoorCouch = useGLTF("outdoorCouch.glb");
  const fence = useGLTF("Fence.glb");
  const plant = useGLTF("plants.glb");

  const outdoorCouchTexture = useLoader(THREE.TextureLoader, "outdoorCouch.jpg")
  const fenceTexture = useLoader(THREE.TextureLoader, "Fence.jpg");
  const plantTexture = useLoader(THREE.TextureLoader, "Plants.jpg");

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