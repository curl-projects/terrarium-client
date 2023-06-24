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
      scale={1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        wireframe={false}
        color={hovered ? "#4b5563" : "orange"}
      />
    </mesh>
  )
}