import * as THREE from 'three'
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber'
import { CurveModifier, Line } from "@react-three/drei";
import Points3D from './Points3D';
import { Points, PointMaterial } from '@react-three/drei';

export default function Path(props){

    // useFrame((state, delta) => )
    const roadHeight = 1

    // const points = useMemo(() => new THREE.CatmullRomCurve3([
    //     new THREE.Vector3( 15, roadHeight, 11 ),
    //     new THREE.Vector3( 12, roadHeight, 12 ),
    //     new THREE.Vector3( 11, roadHeight, 11 ),     
    //     new THREE.Vector3( 11, roadHeight, 9 ),
    //     new THREE.Vector3( 12, roadHeight, 8 ),
    //     new THREE.Vector3( 12, roadHeight, 5 ),
    //     new THREE.Vector3( 15, roadHeight, 3 ),
    //     new THREE.Vector3( 17, roadHeight, 7 ),
    //     new THREE.Vector3( 16, roadHeight, 8 ),
    //     new THREE.Vector3( 16, roadHeight, 9 ),
    //     new THREE.Vector3( 17, roadHeight, 11 )
    //   ]).getPoints(1000), [])

    const curveRef = useRef()

      const curve = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(791.885838461129*0.01, 815.0659980425542*0.01, -493.63246313288806*0.01),
        new THREE.Vector3(575.8550597864444*0.01, 895.7642637676418*0.01, -655.795083815404*0.01),
        new THREE.Vector3(448.2773999468326*0.01, 732.3013496358194*0.01, -213.6226945023933*0.01),
        new THREE.Vector3(215.90231971941424*0.01, 781.7053915221705*0.01, -920.339926228606*0.01),
        new THREE.Vector3(47.94060288715792*0.01, 521.4678414053403*0.01, -390.7969892622272*0.01),
        new THREE.Vector3(-264.0620015335658*0.01, 690.7479831638163*0.01, 46.653898421811164*0.01),
        new THREE.Vector3(-530.7997887690419*0.01, 795.6006772705643*0.01, -590.7463633497655*0.01)
    ]).getPoints(1000), [])

    // const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

    return(
    <group {...props}>
        <points />
        <Line worldUnits points={curve} color="turquoise" lineWidth={0.3} rotation={[0, 2.3, 0]}/>
        {/* <Points positions={curve} scale={0.01}>
            <PointMaterial 
                // color={props.titleHovered ? "#7E988E" : "rgba(145, 170, 160, 0.8)"} 
                // color={props.titleHovered ? "#7E988E" : "white"} 
                color='green'
                size={1} 
                sizeAttenuation={true} 
                depthWrite={true} 
                transparent={true} 
            opacity={1}/>
        </Points> */}
    </group>
    )
}