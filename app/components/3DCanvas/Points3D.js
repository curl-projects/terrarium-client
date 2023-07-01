import * as THREE from 'three'
import { useState, useMemo } from "react";
import { inSphere, onSphere, inCircle} from "maath/random";
import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import { rgb } from "d3";

const AnimatedPoints = animated(Points)
const AnimatedPointMaterial = animated(PointMaterial)

export default function Points3D(props){
    const [sphere] = useState(() => inSphere(new Float32Array(500001), { radius: 1.5 }))

    const curve = useMemo(() => new THREE.CatmullRomCurve3([
      new THREE.Vector3(791.885838461129, 815.0659980425542, -493.63246313288806),
      new THREE.Vector3(575.8550597864444, 895.7642637676418, -655.795083815404),
      new THREE.Vector3(448.2773999468326, 732.3013496358194, -213.6226945023933),
      new THREE.Vector3(215.90231971941424, 781.7053915221705, -920.339926228606),
    new THREE.Vector3(47.94060288715792, 521.4678414053403, -390.7969892622272),
      new THREE.Vector3(-264.0620015335658, 690.7479831638163, 46.653898421811164),
      new THREE.Vector3(-530.7997887690419, 795.6006772705643, -590.7463633497655)
  ]), [])

    const springs = useSpring({
        scale: props.titleHovered ? 1 : 1
    })

    useFrame((state, delta) => {
      props.pointsRef.current.position.x += Math.sin(delta / 10)
      props.pointsRef.current.position.y += Math.sin(delta / 10)
        // props.pointsRef.current.rotation.x -= delta / 5
        // props.pointsRef.current.rotation.y -= delta / 5
      })

      return (
        <group>
          <AnimatedPoints ref={props.pointsRef} positions={sphere} frustumCulled={false} scale={springs.scale} {...props}>
            <PointMaterial 
                color={props.titleHovered ? "#7E988E" : "rgba(145, 170, 160, 0.8)"} 
                // color={props.titleHovered ? "#7E988E" : "white"} 
                size={0.005} 
                sizeAttenuation={true} 
                depthWrite={true} 
                transparent={true} 
                opacity={1}/>
          </AnimatedPoints>
        </group>
      )
}