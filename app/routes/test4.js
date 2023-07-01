import React from 'react'
import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, LineLoop, Vector3 } from 'three'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { CurveModifier } from '@react-three/drei'


const cameraPosition = new Vector3(0, 10, 20)

function CurveModifierScene() {
  const curveRef = React.useRef()
  const geomRef = React.useRef()

  const handlePos = React.useMemo(
    () =>
      [
        { x: 10, y: 0, z: -10 },
        { x: 10, y: 0, z: 10 },
        { x: -10, y: 0, z: 10 },
        { x: -10, y: 0, z: -10 },
      ].map((hand) => new Vector3(...Object.values(hand))),
    []
  )

  const curve = React.useMemo(() => new CatmullRomCurve3(handlePos, true, 'centripetal'), [handlePos])

  const line = React.useMemo(
    () =>
      new LineLoop(new BufferGeometry().setFromPoints(curve.getPoints(50)), new LineBasicMaterial({ color: 0x00ff00 })),
    [curve]
  )

  useFrame(() => {
    if (curveRef.current) {
      curveRef.current?.moveAlongCurve(0.001)
    }
  })

  // React.useEffect(() => {
  //   geomRef.current.rotateX(Math.PI)
  // }, [])

  return (
    <>
      <CurveModifier ref={curveRef} curve={curve}>
        <mesh>
          <boxGeometry args={[10, 10]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      </CurveModifier>
      <primitive object={line} />
    </>
  )
}

export default function FinnCanvas(){
  return(
    <Canvas camera={{ position: [0, 25, 0]}} style={{height: "100vh", width: "100vw"}}>
      <CurveModifierScene />
    </Canvas>
  )
}