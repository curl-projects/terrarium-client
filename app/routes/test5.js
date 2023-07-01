import React from 'react'
import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, LineLoop, Vector3 } from 'three'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { CurveModifier, Points, Point, PointMaterial } from '@react-three/drei'


const cameraPosition = new Vector3(0, 10, 20)

function CurveModifierScene(props) {
  const curveRef = React.useRef()
  const geomRef = React.useRef()

  const handlePos = React.useMemo(
    () =>
      [
        { x: 791.885838461129*0.01, y: 0*0.01, z: -493.63246313288806*0.01},
        { x: 575.8550597864444*0.01, y:0*0.01, z: -655.795083815404*0.01 },
        { x: 448.2773999468326*0.01, y: 0*0.01, z:-213.6226945023933*0.01 },
        { x: 215.90231971941424*0.01, y: 0*0.01, z: -920.33992622860*0.01}
      ].map((hand) => new Vector3(...Object.values(hand))),
    []
  )

  const curve = React.useMemo(() => new CatmullRomCurve3(handlePos, true, 'centripetal'), [handlePos])

//   const curve = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(791.885838461129, 815.0659980425542, -493.63246313288806),
//     new THREE.Vector3(575.8550597864444, 895.7642637676418, -655.795083815404),
//     new THREE.Vector3(448.2773999468326, 732.3013496358194, -213.6226945023933),
//     new THREE.Vector3(215.90231971941424, 781.7053915221705, -920.339926228606),
//   new THREE.Vector3(47.94060288715792, 521.4678414053403, -390.7969892622272),
//     new THREE.Vector3(-264.0620015335658, 690.7479831638163, 46.653898421811164),
//     new THREE.Vector3(-530.7997887690419, 795.6006772705643, -590.7463633497655)
// ])

  const line = React.useMemo(
    () =>
      new LineLoop(new BufferGeometry().setFromPoints(curve.getPoints(50)), new LineBasicMaterial({ color: 0x00ff00 })),
    [curve]
  )

  useFrame(() => {
    if (curveRef.current) {
      curveRef.current?.moveAlongCurve(props.speed)
    }
  })

  // React.useEffect(() => {
  //   geomRef.current.rotateX(Math.PI)
  // }, [])

  return (
    <>
      <CurveModifier ref={curveRef} curve={curve}>
        <mesh>
          <sphereGeometry color='green' />
          <PointMaterial attach="material" />
          {/* <Point position={[1, 2, 3]} col='red'></Point> */}
        </mesh>
      </CurveModifier>
      <primitive object={line} />
    </>
  )
}

export default function FinnCanvas(){
  return(
    <Canvas camera={{ position: [0, 25, 0]}} style={{height: "100vh", width: "100vw"}}>
      <CurveModifierScene speed={0.001}/>
      <CurveModifierScene speed={0.002}/>
    </Canvas>
  )
}