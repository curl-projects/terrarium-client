import { CurveModifier, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
uniform float uTime;
uniform float uRadius;

// Source: https://github.com/dmnsgn/glsl-rotate/blob/main/rotation-3d-y.glsl.js
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}


void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 1.5 + 5.0;
  vec3 particlePosition = position * rotation3dY(uTime * 0.3 * distanceFactor);

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;
  gl_PointSize *= (1.5 / - viewPosition.z);
}

`
const fragmentShader = `
void main() {
    gl_FragColor = vec4(0.34, 0.53, 0.96, 1.0);
  }
  `
  

const CustomGeometryParticles = (props) => {
  const { count } = props;
  const radius = 2;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360); 
      const phi = THREE.MathUtils.randFloatSpread(360); 

      let x = distance * Math.sin(theta) * Math.cos(phi)
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);

      positions.set([x, y, z], i * 3);
    }
    
    return positions;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: {
      value: 0.0
    },
    uRadius: {
      value: radius
    }
  }), [])

  useFrame((state) => {
    const { clock } = state;

    points.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(791.885838461129, 815.0659980425542, -493.63246313288806),
    new THREE.Vector3(575.8550597864444, 895.7642637676418, -655.795083815404),
    new THREE.Vector3(448.2773999468326, 732.3013496358194, -213.6226945023933),
    new THREE.Vector3(215.90231971941424, 781.7053915221705, -920.339926228606),
  new THREE.Vector3(47.94060288715792, 521.4678414053403, -390.7969892622272),
    new THREE.Vector3(-264.0620015335658, 690.7479831638163, 46.653898421811164),
    new THREE.Vector3(-530.7997887690419, 795.6006772705643, -590.7463633497655)
])

const curveRef = useRef()

  return (
    <CurveModifier curve={curve} curveRef={curveRef}>
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
    </CurveModifier>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [2.0, 2.0, 2.0] }} style={{height: "100vh", width: "100vw"}}>
      <ambientLight intensity={0.5} />
      <CustomGeometryParticles count={4000} />
      <OrbitControls />
    </Canvas>
  );
};


export default Scene;
