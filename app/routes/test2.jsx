import { CurveModifier, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { inSphere, onSphere, inCircle} from "maath/random";


const CustomGeometryParticles = (props) => {
  const { count, shape } = props;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    if (shape === "box") {
      for (let i = 0; i < count; i++) {
        let x = (Math.random() - 0.5) * 2;
        let y = (Math.random() - 0.5) * 2;
        let z = (Math.random() - 0.5) * 2;

        positions.set([x, y, z], i * 3);
      }
    }

    if (shape === "sphere") {
      const distance = 1;
     
      for (let i = 0; i < count; i++) {
        const theta = THREE.MathUtils.randFloatSpread(360); 
        const phi = THREE.MathUtils.randFloatSpread(360); 

        let x = distance * Math.sin(theta) * Math.cos(phi)
        let y = distance * Math.sin(theta) * Math.sin(phi);
        let z = distance * Math.cos(theta);

        positions.set([x, y, z], i * 3);
      }
    }

    return positions;
  }, [count, shape]);

  const [sphere] = useState(() => inSphere(new Float32Array(5001), { radius: 1.5 }))

//   useFrame((state) => {
//     const { clock } = state;

//     for (let i = 0; i < count; i++) {
//         const i3 = i * 3;
    
//         // x
//         points.current.geometry.attributes.position.array[i3] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;

//         // y
//         points.current.geometry.attributes.position.array[i3 + 1] += Math.cos(clock.elapsedTime + Math.random() * 10) * 0.01;

//         // z
//         points.current.geometry.attributes.position.array[i3 + 2] += Math.sin(clock.elapsedTime + Math.random() * 10) * 0.01;
//         }
    
//         points.current.geometry.attributes.position.needsUpdate = true;

//     })

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(791.885838461129, 815.0659980425542, -493.63246313288806),
    new THREE.Vector3(575.8550597864444, 895.7642637676418, -655.795083815404),
    new THREE.Vector3(448.2773999468326, 732.3013496358194, -213.6226945023933),
    new THREE.Vector3(215.90231971941424, 781.7053915221705, -920.339926228606),
  new THREE.Vector3(47.94060288715792, 521.4678414053403, -390.7969892622272),
    new THREE.Vector3(-264.0620015335658, 690.7479831638163, 46.653898421811164),
    new THREE.Vector3(-530.7997887690419, 795.6006772705643, -590.7463633497655)
])

  return (
    <CurveModifier curve={curve}>
        <Points ref={points} positions={sphere}>
        {/* <bufferGeometry>
            <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
            />
        </bufferGeometry> */}
        <PointMaterial size={0.05} color="green" sizeAttenuation depthWrite={false} />
        </Points>
    </CurveModifier>
  );
};

const Scene = () => {

  return (
    <Canvas camera={{ position: [1.5,1.5,1.5] }} style={{height: "100vh", width: "100vw"}}>
      <ambientLight intensity={0.5} />
      {/* Try to change the shape prop to "box" and hit reload! */}
      <CustomGeometryParticles count={2000} shape="sphere"/>
      <OrbitControls />
    </Canvas>
  );
};


export default Scene;
