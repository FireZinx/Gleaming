"use client"

import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { assetUrl } from '../assetUrl'

export default function BedRoomMesh () {
    const bedroom = useGLTF(assetUrl("bedroom.glb"));
    const masterBedRoom = useGLTF(assetUrl("masterbedroom.glb"))
    const pillow = useGLTF(assetUrl("pillow.glb"))
    const decoration = useGLTF(assetUrl("decorationRoom.glb"))
    const decorationRoom = useGLTF(assetUrl("decoration.glb"))

    const bedroomTexture = useTexture(assetUrl("bedRoom.jpg"))
    const masterTextute = useTexture(assetUrl("masterBedRoom.jpg"))
    const pillowTexture = useTexture(assetUrl("Pillow.jpg"))
    const decorationRoomTexture = useTexture(assetUrl("decorationRoom.jpg"))
    const decorationTexture = useTexture(assetUrl("Decoration.jpg"))

    bedroomTexture.flipY = false
    bedroomTexture.channel = 0
    masterTextute.flipY = false
    masterTextute.channel = 1
    pillowTexture.flipY = false
    pillowTexture.channel = 1
    decorationRoomTexture.flipY = false
    decorationRoomTexture.channel = 1
    decorationTexture.flipY = false
    decorationTexture.channel = 1

    return(    
        <>      
            <mesh geometry={(bedroom.nodes.Modern_Bed006 as THREE.Mesh).geometry} scale={1.4}>
                <meshPhysicalMaterial map={bedroomTexture} side={THREE.DoubleSide}/>
            </mesh>
            <mesh geometry={(masterBedRoom.nodes.cover002 as THREE.Mesh).geometry} scale={1.4}>
                <meshPhysicalMaterial map={masterTextute} side={THREE.DoubleSide}/>
            </mesh>
            <mesh geometry={(pillow.nodes.Cube005 as THREE.Mesh).geometry} scale={1.4}>
                <meshPhysicalMaterial map={pillowTexture} side={THREE.DoubleSide}/>
            </mesh>

            <mesh geometry={(decoration.nodes.Plane006 as THREE.Mesh).geometry} scale={1.4}>
                <meshPhysicalMaterial map={decorationRoomTexture} side={THREE.DoubleSide}/>
            </mesh>
            <mesh geometry={(decorationRoom.nodes.Modern_Bed005 as THREE.Mesh).geometry} scale={1.4}>
                <meshPhysicalMaterial map={decorationTexture} side={THREE.DoubleSide}/>
            </mesh>
        </>
    )
}