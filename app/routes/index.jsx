import { Form, useSubmit } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import { Canvas } from "@react-three/fiber";
import { useState, useRef } from 'react';
import Points3D from '~/components/3DCanvas/Points3D.js';
import { OrbitControls, Html } from '@react-three/drei';
import { ClientOnly } from "remix-utils";

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
      <Canvas gl={{ antialias: true}}
              camera={{ position: [0, 0, 0.5] }} 
              style={{width: '100vw', height: "100vh"}} 
              linear>
                <Points3D titleHovered={titleHovered} pointsRef={pointsRef}/>
                <Html
                 distanceFactor={0.5}
                 position={[0, 0, 0]}
                 transform
                 occlude="blending"
                >
                <h1 
                  className="terrarium-logo"
                  onPointerOver={()=>setTitleHovered(true)}
                  onPointerOut={()=>setTitleHovered(false)}
                  onClick={handleSubmit}
                  style={{cursor: "pointer", userSelect: "none"}}
            
                >Terrarium</h1>
                </Html>
            </Canvas> 
          
    )}
    </ClientOnly>
    </>
  );
};

// <button style={BUTTON_STYLES}>Login with Google</button>
{/* <img className='terrarium' src={terrarium}></img>
          <div style={{textAlign: 'center', marginTop: "5px"}}>
            <h3 className='logInText'>Log In</h3>
          </div> */}