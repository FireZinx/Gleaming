"use client"

import * as THREE from 'three'
import { useGLTF,  MeshTransmissionMaterial} from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { DoubleSide } from "three";
import { assetUrl } from '../assetUrl'

export default function Balcony() {
  const outdoorCouch = useGLTF(assetUrl("outdoorCouch.glb"));
  const fence = useGLTF(assetUrl("Fence.glb"));
  const plant = useGLTF(assetUrl("plants.glb"));

  const outdoorCouchTexture = useLoader(THREE.TextureLoader, assetUrl("outdoorCouch.jpg"))
  const fenceTexture = useLoader(THREE.TextureLoader, assetUrl("Fence.jpg"));
  const plantTexture = useLoader(THREE.TextureLoader, assetUrl("Plants.jpg"));

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