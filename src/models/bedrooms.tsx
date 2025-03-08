import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'

export default function BedRoomMesh (props) {
    const bedroom = useGLTF("bedroom.glb");
    const masterBedRoom = useGLTF("masterBedRoom.glb")
    const decoration = useGLTF("decorationRoom.glb")

    const bedroomTexture = useTexture("bedRoom.jpg")
    const masterTextute = useTexture("masterBedRoom.jpg")
    const decorationTexture = useTexture("Decoration.jpg")

    bedroomTexture.flipY = false
    bedroomTexture.channel = 1
    masterTextute.flipY = false
    masterTextute.channel = 1
    decorationTexture.flipY = false
    decorationTexture.channel = 1

    return(    
        <>      
            <mesh geometry={bedroom.nodes.Modern_Bed001.geometry} scale={1.4}>
                <meshPhysicalMaterial map={bedroomTexture} side={THREE.DoubleSide}/>
            </mesh>
            <mesh geometry={masterBedRoom.nodes.body_legs002.geometry} scale={1.4}>
                <meshPhysicalMaterial map={masterTextute} side={THREE.DoubleSide}/>
            </mesh>
            <mesh geometry={decoration.nodes.Plane006.geometry} scale={1.4}>
                <meshPhysicalMaterial map={decorationTexture} side={THREE.DoubleSide}/>
            </mesh>
        </>
    )
}