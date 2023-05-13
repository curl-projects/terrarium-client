import { useState, useRef } from 'react';
import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "remix-utils";
import { OrbitControls, Html } from '@react-three/drei';
import Points3D from './Points3D.js';


export default function CanvasScaffold3D(){
    const [titleHovered, setTitleHovered] = useState(false)
    const pointsRef = useRef()

    function handleTitleHovered(e){
        setTitleHovered(true);
    }
    
    return(
        <>
        <ClientOnly>
            {() => (
            <Canvas camera={{ position: [0, 0, 0.5] }} style={{width: '100vw', height: "100vh"}}>
                <Points3D titleHovered={titleHovered} pointsRef={pointsRef}/>
                <Html
                 distanceFactor={0.5}
                 position={[0, 0, 0]}
                 transform
                >
                    <h1 className="terrarium-logo" 
                        onPointerOver={handleTitleHovered}
                        onPointerOut={()=>setTitleHovered(false)}
                    >Terrarium </h1>

                </Html>
                {/* <OrbitControls /> */}
            </Canvas> 
            )}
        </ClientOnly>
        </>
    )
}