import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { ClientOnly } from "remix-utils";
import Points3D from '~/components/3DCanvas/Points3D.js';

export default function FinnTestSix(){
    const pointsRef = useRef;

    return(
        <>
        <ClientOnly>

        {() => (<div style={{height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <div className='shapeDiv'>
            <Canvas gl={{ antialias: true}}
              camera={{ position: [0, 0, 0.5] }} 
              style={{width: '100%', height: "100%"}} 
              linear>
                <Points3D pointsRef={pointsRef}/>
              </Canvas>

            </div>
        </div>)}
        </ClientOnly>
        </>
    )
}