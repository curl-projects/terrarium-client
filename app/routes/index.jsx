import { Form, useSubmit } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { Canvas } from "@react-three/fiber";
import { useState, useRef } from 'react';
import Points3D from '~/components/3DCanvas/Points3D.js';
import { OrbitControls, Html } from '@react-three/drei';
import { ClientOnly } from "remix-utils";
import { RiPlantLine} from "react-icons/ri"
import Cylinder3D from "~/components/3DCanvas/UnusedComponents/Cylinder3D";
export default function Index(){
  const submit = useSubmit();
  const [titleHovered, setTitleHovered] = useState(false)
  const pointsRef = useRef()

  function handleSubmit(event){
    submit(null, {method: "post", "action": `/auth/${SocialsProvider.GOOGLE}`})
  }

  return (
    <>
    <ClientOnly>
    {() => (
      <div style={{height: "100vh", width: "100vw", clipPath: "polygon(0% 81%, 2% 73%, 3% 71%, 5% 67%, 8% 65%, 12% 63%, 16% 63%, 21% 62%, 26% 62%, 29% 61%, 35% 61%, 43% 58%, 51% 52%, 53% 47%, 56% 43%, 59% 38%, 60% 32%, 61% 25%, 61% 22%, 61% 18%, 61% 15%, 61% 8%, 62% 4%, 63% 1%, 88% 0%, 88% 6%, 87% 11%, 87% 14%, 87% 19%, 87% 28%, 87% 25%, 86% 32%, 86% 35%, 83% 38%, 83% 45%, 80% 47%, 79% 51%, 76% 57%, 74% 59%, 69% 62%, 67% 64%, 64% 67%, 57% 70%, 62% 69%, 53% 74%, 50% 76%, 46% 79%, 43% 80%, 40% 83%, 33% 85%, 37% 84%, 26% 89%, 31% 87%, 24% 90%, 22% 91%, 21% 95%, 20% 98%, 16% 99%, 0% 99%)"}}>
      <Canvas gl={{ antialias: true}}
              camera={{ position: [0, 0, 0.5] }} 
              style={{width: '100vw', height: "100vh"}} 
              linear>
                <Points3D titleHovered={titleHovered} pointsRef={pointsRef}/>
                {/* <Cylinder3D titleHovered={titleHovered}/> */}
                <Html
                 distanceFactor={0.5}
                 position={[0, 0, 0]}
                 transform
                //  occlude="blending"
                >
                <h1 
                  className="terrarium-logo"
                  onPointerOver={()=>setTitleHovered(true)}
                  onPointerOut={()=>setTitleHovered(false)}
                  onClick={handleSubmit}
                  style={{cursor: "pointer", userSelect: "none"}}>
                  <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
                  Terrarium
                </h1>
                </Html>
            </Canvas> 
            </div>
          
    )}
    </ClientOnly>
    </>
  );
};