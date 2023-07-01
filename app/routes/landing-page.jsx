import { OrbitControls, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react"
import { RiPlantLine} from "react-icons/ri"
import { ClientOnly } from "remix-utils"
import RiverPoints from "~/components/3DCanvas/RiverPoints"

export default function LandingPage(){
    const pointsRef = useRef();
    const outlineRef = useRef()

    return(
        <div className='landingPageIntro'>
            <div className='landingPageIntroLeft'>
                <div style={{flex: 0.4}}/>
                <div className='landingPageLogoWrapper'>
                    <h1 className='landingPageLogo'>
                    <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
                    Terrarium
                    </h1>
                </div>
                <div className='terrariumTagline'>

                </div>
                <div style={{flex: 0.6}}/>
            </div>
            <div className='landingPageIntroRight'>
                <div className='terrariumRiverWrapper'>
                    <ClientOnly>
                        {() => (
                            <Canvas
                                gl={{ antialias: true}}
                                camera={{ position: [1.5, 0, 0] }} 
                                style={{width: '100%', height: "100%"}} 
                                linear>
                            <OrbitControls />
                            <ambientLight />
                            <RiverPoints pointsRef={pointsRef} outlineRef={outlineRef}/>
                            </Canvas>
                        )}
                    </ClientOnly>
                </div>
            </div>

        </div>
    )
}