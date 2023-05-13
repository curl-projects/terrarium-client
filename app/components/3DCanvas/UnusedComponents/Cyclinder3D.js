import { useRef, useState } from 'react';
import { useFrame } from "@react-three/fiber";
import { useCursor } from '@react-three/drei';

export default function Cylinder3D(props){
  const ref = useRef();
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  useFrame((state, delta) => (
      ref.current.rotation.y += 0.5/100,
      ref.current.rotation.x += 0.5/100
      ));

  useCursor(hovered);

  return(
    <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick = {(e) => click(!clicked)}
        onPointerOver ={(e) => hover(true)}
        onPointerOut ={(e) => hover(false)}
    >        
        <boxBufferGeometry args={[2, 2, 2]}/>
        <meshLambertMaterial color='darkblue'/>
    </mesh>
  )
}