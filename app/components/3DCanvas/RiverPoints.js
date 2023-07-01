import * as THREE from 'three'
import { useState, useMemo } from "react";
import { inSphere, onSphere, inCircle, inRect} from "maath/random";
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { rgb } from "d3";

const AnimatedPoints = animated(Points)
const AnimatedPointMaterial = animated(PointMaterial)

export default function RiverPoints(props){
    const [sphere] = useState(() => inSphere(new Float32Array(5001), { radius: 15 }))

    const springs = useSpring({
        scale: 1
    })

    useFrame((state, delta) => {
        // console.log("DELTA:", delta)
        props.pointsRef.current.rotation.y += delta / 30
        props.outlineRef.current.rotation.y += delta / 30
        // props.pointsRef.current.position.y += delta / 10
    //   props.pointsRef.current.position.y -= delta / 10
        // props.pointsRef.current.rotation.x += delta / 2
        // props.pointsRef.current.rotation.z -= delta / 2
        // props.pointsRef.current.rotation.x += delta / 2
      })

      return (
        <group>
        <AnimatedPoints 
            ref={props.outlineRef} 
            positions={sphere} 
            frustumCulled={false} 
            scale={springs.scale} {...props}>
            <PointMaterial 
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
            frustumCulled={false} 
            scale={springs.scale} {...props}>
            <PointMaterial 
                color="rgb(190, 203, 198)"
                size={10} 
                sizeAttenuation={false} 
                depthWrite={true} 
                transparent={true} 
                opacity={1}/>
          </AnimatedPoints>
    </group>
      )
}