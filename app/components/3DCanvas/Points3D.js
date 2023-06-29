import { useState } from "react";
import { inSphere } from "maath/random";
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { rgb } from "d3";

const AnimatedPoints = animated(Points)
const AnimatedPointMaterial = animated(PointMaterial)

export default function Points3D(props){
    const [sphere] = useState(() => inSphere(new Float32Array(5000), { radius: 1.5 }))

    const springs = useSpring({
        scale: props.titleHovered ? 1 : 1,
    })

    useFrame((state, delta) => {
        props.pointsRef.current.rotation.x -= delta / 5
        props.pointsRef.current.rotation.y -= delta / 5
      })

      return (
        <group>
          <AnimatedPoints ref={props.pointsRef} positions={sphere} frustumCulled={false} scale={springs.scale} {...props}>
            <PointMaterial 
                color={props.titleHovered ? "#7E988E" : "rgba(145, 170, 160, 0.8)"} 
                // color={props.titleHovered ? "#7E988E" : "white"} 
                size={0.01} 
                sizeAttenuation={true} 
                depthWrite={true} 
                transparent={true} 
                opacity={0.9}/>
          </AnimatedPoints>
        </group>
      )
}