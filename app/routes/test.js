import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "remix-utils";
import Cylinder3D from "~/components/3DCanvas/UnusedComponents/Cylinder3D"
import Path from "~/components/3DCanvas/Path";
import { Center, Float, FlyControls, OrbitControls, GizmoHelper, GizmoViewcube, GizmoViewport, KeyboardControls, PerspectiveCamera, Resize } from "@react-three/drei";
import { useRef, useEffect } from 'react';

export default function Test(){
    const cameraRef = useRef();

    useEffect(()=>{ 
        console.log("REF:", cameraRef.current)
    }, [cameraRef.current])
    return(
    <>
        <Canvas ref={cameraRef} camera={{ position: [0, 25, 0]}} style={{height: "100vh", width: "100vw"}}>
            {/* <PerspectiveCamera makeDefault /> */}
            {/* <OrbitControls enableRotate={true}
                onChange={(e) => console.log("CHANGE:", e.target)}
            /> */}
            {/* <Center> */}
            {/* <FlyControls /> */}
            {/* <Float speed={4} rotationIntensity={1} floatIntensity={2}> */}
                <Path />
            {/* </Center> */}
            {/* </Float> */}
            <GizmoHelper
                alignment="bottom-right" // widget alignment within scene
                margin={[80, 80]} // widget margins (X, Y)

                >
                <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
                <GizmoViewcube />
                {/* alternative: <GizmoViewcube /> */}
                </GizmoHelper>
        </Canvas>
    </>
    )
}