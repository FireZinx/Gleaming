"use client"

import React, { Ref } from 'react'
import { extend, ThreeElement } from '@react-three/fiber'
import { ShaderMaterial, TextureLoader, Vector3 } from 'three'

export class CustomShader extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        ftexture: { value: null },
        stexture: { value: null },
        time: { value: 0 },
        color: { value: new Vector3(0.440, 0.314, 1) }
      },
      vertexShader: /*glsl*/`
				varying vec2 vUv;
        varying vec3 pos;

				void main() {
					vUv = uv;

          //vUv += vec2(0.5, 0);

          float dist = distance(position, vec3(0.));

          pos = position;

          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition; 
				}
      `,
      fragmentShader: /*glsl*/`
        uniform float time;
        uniform sampler2D ftexture;
        uniform sampler2D stexture;
        uniform vec3 color;
        varying vec3 pos;
        varying vec2 vUv;


        void main()
        {
          vec4 firstColor = texture2D(ftexture, vUv);
          vec4 secondColor = texture2D(stexture, vUv);

          vec3 textureMix = mix(firstColor.rgb, secondColor.rgb, smoothstep(time, time + 10., clamp(0., 1., pos.x + pos.y * 4.)));
          
          textureMix.rgb = vec3(pow(textureMix.r, 2.2), pow(textureMix.g, 2.2), pow(textureMix.b, 2.2));

          gl_FragColor = vec4(textureMix.rgb, 1.);
        }
      `
    })
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    customShader: ThreeElement<typeof CustomShader>
  }
}

interface ShadersTextureProps {
  ref?: Ref<any>
}

export function ShadersTexture(props: ShadersTextureProps) {
    extend({ CustomShader })

    console.log("Shader component rendered")
  
    return(
        <customShader ref={props.ref} />
    )
}