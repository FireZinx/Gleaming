import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect, JSX } from "react"
import { ShadersTexture } from "../shaders/shaders"
import { assetUrl } from '../assetUrl'

type RoomProps = JSX.IntrinsicElements["group"] &  {
  customTableRef: React.RefObject<THREE.ShaderMaterial | null>;
  customSofaRef: React.RefObject<THREE.ShaderMaterial | null>;
  customChairRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvStandRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvWoodWallRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvFrameRef: React.RefObject<THREE.ShaderMaterial | null>;
  customtvLightRef: React.RefObject<THREE.ShaderMaterial | null>;
}

export default function Room(props: RoomProps) {
  const sofa = useGLTF(assetUrl("Sofa.glb"))
  const chair = useGLTF(assetUrl("Chair.glb"))
  const table = useGLTF(assetUrl("Table.glb"))
  const tvStand = useGLTF(assetUrl("tvstand.glb"))
  const woodWall = useGLTF(assetUrl("woodWall.glb"))
  const frame = useGLTF(assetUrl("Frame.glb"))
  const light = useGLTF(assetUrl("Lights.glb"))
  
  const sofaTexture = useLoader(THREE.TextureLoader, assetUrl("Sofa.jpg"))
  const chairTexture = useLoader(THREE.TextureLoader, assetUrl("Chair.jpg"))
  const tableTexture = useLoader(THREE.TextureLoader, assetUrl("Table.jpg"))
  const tvStandTexture = useLoader(THREE.TextureLoader, assetUrl("TvStand.jpg"))
  const woodWallTexture = useLoader(THREE.TextureLoader, assetUrl("WoodWall.jpg"))
  const frameTexture = useLoader(THREE.TextureLoader, assetUrl("Frame.jpg"))
  const lightTexture = useLoader(THREE.TextureLoader, assetUrl("Light.jpg"))

  /*const sofaTextureShadow = useLoader(THREE.TextureLoader, "sofaShadow.jpg")
  const chairTextureShadow = useLoader(THREE.TextureLoader, "ChairShadow.jpg")
  const tableTextureShadow = useLoader(THREE.TextureLoader, "TableShadow.png")
  const tvStandTextureShadow = useLoader(THREE.TextureLoader, "TvStandShadow.jpg")
  const woodWallTextureShadow = useLoader(THREE.TextureLoader, "WoodWallShadow.jpg")
  const frameTextureShadow = useLoader(THREE.TextureLoader, "FrameShadow.jpg")
  const lightTextureShadow = useLoader(THREE.TextureLoader, "LightShadow.jpg")*/

  sofaTexture.flipY = false
  chairTexture.flipY = false
  tableTexture.flipY = false
  tvStandTexture.flipY = false
  woodWallTexture.flipY = false
  frameTexture.flipY = false
  lightTexture.flipY = false
  /*sofaTextureShadow.flipY = false
  chairTextureShadow.flipY = false
  tableTextureShadow.flipY = false
  tvStandTextureShadow.flipY = false
  woodWallTextureShadow.flipY = false
  frameTextureShadow.flipY = false
  lightTextureShadow.flipY = false*/

  useEffect(() => {
    if (!props.customTableRef.current) return;
    if (!props.customSofaRef.current) return;
    if (!props.customChairRef.current) return;
    if (!props.customtvStandRef.current) return;
    if (!props.customtvWoodWallRef.current) return;
    if (!props.customtvFrameRef.current) return;
    if (!props.customtvLightRef.current) return;

    props.customTableRef.current.uniforms.ftexture.value = tableTexture;
    //props.customTableRef.current.uniforms.stexture.value = tableTextureShadow;

    props.customSofaRef.current.uniforms.ftexture.value = sofaTexture;
    //props.customSofaRef.current.uniforms.stexture.value = sofaTextureShadow;

    props.customChairRef.current.uniforms.ftexture.value = chairTexture;
    //props.customChairRef.current.uniforms.stexture.value = chairTextureShadow;
    
    props.customtvStandRef.current.uniforms.ftexture.value = tvStandTexture;
    //props.customtvStandRef.current.uniforms.stexture.value = tvStandTextureShadow;
    
    props.customtvWoodWallRef.current.uniforms.ftexture.value = woodWallTexture;
    //props.customtvWoodWallRef.current.uniforms.stexture.value = woodWallTextureShadow;
    
    props.customtvFrameRef.current.uniforms.ftexture.value = frameTexture;
    //props.customtvFrameRef.current.uniforms.stexture.value = frameTextureShadow;

    props.customtvLightRef.current.uniforms.ftexture.value = lightTexture;
    //props.customtvLightRef.current.uniforms.stexture.value = lightTextureShadow;
    
  }, [sofaTexture, /*sofaTextureShadow,*/ chairTexture, /*chairTextureShadow,*/ tableTexture, /*tableTextureShadow, */tvStandTexture, /*tvStandTextureShadow,*/ woodWallTexture, /*woodWallTextureShadow,*/ frameTexture, /*frameTextureShadow,*/ lightTexture, /*lightTextureShadow,*/ props.customTableRef, props.customSofaRef, props.customChairRef, props.customtvStandRef, props.customtvWoodWallRef, props.customtvFrameRef, props.customtvLightRef])

  return (
    <>
      <group scale={[1.225, 1.3, 1.5]}>
        <mesh geometry={(sofa.nodes.under_part003 as THREE.Mesh).geometry} scale={[1.15, 1.08, 0.97]} position={[0, 0, -0.16]}>
          <ShadersTexture ref={props.customSofaRef} />   
        </mesh>
      </group>

      <group {...props} dispose={null} scale={[1.4, 1.4, 1.4]}>
        <mesh geometry={(chair.nodes.Leme_chair001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customChairRef} />
        </mesh>

        <mesh geometry={(table.nodes.Table001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customTableRef} />
        </mesh>

        <mesh geometry={(tvStand.nodes.Cube001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvStandRef}/>
        </mesh>

        <mesh geometry={(woodWall.nodes.Plane005 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvWoodWallRef} />
        </mesh>

        <mesh geometry={(frame.nodes.Buffet_bazalt002 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvFrameRef} />
        </mesh>

         <mesh position={[0.017, 0, 0.005]} scale={1} rotation={[0, 0, Math.PI]} geometry={(light.nodes.Lights001 as THREE.Mesh).geometry}>
          <ShadersTexture ref={props.customtvLightRef} />
        </mesh>
      </group>
    </>
  )
}