import { Canvas } from "@react-three/fiber";
import { ClientOnly } from "remix-utils";
import Cylinder3D from "~/components/3DCanvas/UnusedComponents/Cylinder3D"

export default function Test(){
    return(
    <>
        <ClientOnly>
            {() => (
            <Canvas style={{height: "100vh", width: "100%"}}>
            <pointLight position={[10, 10, 10]} />
            <ambientLight />
            <Cylinder3D position={[1, 0, 0]} />
            </Canvas> 
                
            )}
        </ClientOnly>
    </>
    )
}