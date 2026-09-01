"use client"

import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'

export default function Carpet() {
    const carpet = useGLTF("carpet.glb")
    const texture = useTexture("Carpet.jpg")

    texture.flipY = false
    texture.channel = 1

    return (
        <mesh geometry={(carpet.nodes.Geometric_Modern_Rug001 as THREE.Mesh).geometry} rotation={[0, -1.571, 0]} scale={1.4}>
            <meshPhysicalMaterial map={texture} side={THREE.DoubleSide}/>
        </mesh>
    )   
}