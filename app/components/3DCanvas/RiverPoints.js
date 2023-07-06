import * as THREE from 'three'
import { useState, useMemo } from "react";
import { inSphere, onSphere, inCircle, inRect, inBox} from "maath/random";
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { rgb } from "d3";

const AnimatedPoints = animated(Points)
const AnimatedPointMaterial = animated(PointMaterial)

export default function RiverPoints(props){
    const [sphere] = useState(() => inSphere(new Float32Array(1001), { radius: 20 }))

    const springs = useSpring({
        scale: props.titleHovered ? 1 : 1
    })

    useFrame((state, delta) => {
        // console.log("DELTA:", delta)
        // props.pointsRef.current.rotation.y += delta / 20
        // props.outlineRef.current.rotation.y += delta / 20
        props.pointsRef.current.rotation.z += delta / 25
        props.outlineRef.current.rotation.z += delta / 25
        // props.pointsRef.current.position.y += delta / 10
    //   props.pointsRef.current.position.y -= delta / 10
        props.pointsRef.current.rotation.x += delta / 25
        props.outlineRef.current.rotation.x += delta / 25
        // props.pointsRef.current.rotation.z -= delta / 2
    
      })

      return (
        <group>
        <AnimatedPoints 
            ref={props.outlineRef} 
            positions={sphere}
            frustumCulled={true} 
            scale={springs.scale} {...props}>
            <PointMaterial 
                position={[55, 0, 0]}
                color="rgb(119, 153, 141)"
                size={14} 
                sizeAttenuation={false} 
                depthWrite={false} 
                transparent={true} 
                opacity={1}/>
          </AnimatedPoints>
          <AnimatedPoints 
            ref={props.pointsRef} 
            positions={sphere} 
            frustumCulled={true} 
            scale={springs.scale} {...props}>
            <PointMaterial 
                color="#d5f7ea"
                size={10} 
                sizeAttenuation={false} 
                depthWrite={false} 
                transparent={true} 
                opacity={1}/>
          </AnimatedPoints>
    </group>
      )
}