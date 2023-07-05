import { OrbitControls, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react"
import { RiPlantLine} from "react-icons/ri"
import { ClientOnly } from "remix-utils"
import { BsX } from "react-icons/bs";
import { ImSearch } from "react-icons/im"
import { BiCurrentLocation, BiNetworkChart } from "react-icons/bi";
import { MdOutlineFilterList } from "react-icons/md"
import { GoTelescope } from 'react-icons/go'
import { BiNotepad } from 'react-icons/bi'

import RiverPoints from "~/components/3DCanvas/RiverPoints"
import LandingPageMessageStreamTitle from "~/components/LandingPage/LandingPageMessageStreamTitle";
import PlaceholderDataSources from "~/components/LandingPage/PlaceholderDataSources";
import PlaceholderMessageStream from "~/components/LandingPage/PlaceholderMessageStream";
import LandingPageMovingTitle from "~/components/LandingPage/LandingPageMovingTitle";
import LandingPageFeatureTitle from "~/components/LandingPage/LandingPageFeatureTitle";
import LandingPageRoadmapTitle from "~/components/LandingPage/LandingPageRoadmapTitle";
import Roadmap from "~/components/Roadmap/Roadmap";
import PlaceholderRoadmap from "~/components/LandingPage/PlaceholderRoadmap";
import PlaceholderFeature from "~/components/LandingPage/PlaceholderFeature";
import { useEffect } from "react";
import LandingPageWaitListTitle from "~/components/LandingPage/LandingPageWaitListTitle";

const fullSearchText = "Whiteboard"
const searchTextDelay = 10

export default function LandingPage(){
    const pointsRef = useRef();
    const outlineRef = useRef();
    const searchBarRef = useRef();
    const [messageStreamIsExpanded, setMessageStreamIsExpanded] = useState(false)

    const [landingPageDataView, setLandingPageDataView] = useState("featureRequests")
    const [landingPageFeatureOutletToggle, setLandingPageFeatureOutletToggle] = useState(false)
    const [landingPageSearchText, setLandingPageSearchText] = useState("")
    const [searchTextIndex, setSearchTextIndex] = useState(-1);
    const [featureDescriptionText, setFeatureDescriptionText] = useState("")

    useEffect(()=>{
        if(searchTextIndex > -1 && searchTextIndex < fullSearchText.length){
            const timeout = setTimeout(() => {
                setLandingPageSearchText(prevState => prevState + fullSearchText[searchTextIndex]);
                setSearchTextIndex(prevIndex => prevIndex + 1);
            }, searchTextDelay)

            return() => clearTimeout(timeout)
        }
    }, [searchTextIndex])

    return(
        <>
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
                <div className='terrariumImageWrapper'>
                </div>
            </div>
        </div>
        <div className='landingPageSection'>
            <div className='landingPageSectionInner'>
                <LandingPageMovingTitle
                    title="Classify and extract feature requests from Discord"
                />
                <div className='landingPageSectionViewportWrapper'>
                    <div className='landingPageSectionMainViewport'>
                        <PlaceholderDataSources />
                    </div>
                </div>
            </div>
        </div>
        <div className='landingPageSection'>
            <div className='landingPageSectionInner'>
                <div className='landingPageSectionViewportWrapper' style={{alignItems: "center", justifyContent: "center"}}>
                <LandingPageMessageStreamTitle 
                    title="Classify and extract feature requests from Discord"
                    leftSide={true}
                    messageStreamIsExpanded={messageStreamIsExpanded}
                    setMessageStreamIsExpanded={setMessageStreamIsExpanded}
                />
                    <div className='landingPageSectionMainViewport' 
                        style={{
                            display: "flex", 
                            justifyContent: "center", 
                            flex: "0.8",
                            padding: "20px",
                            paddingTop: "5px",
                            }}>
                        <PlaceholderMessageStream 
                            messageStreamIsExpanded={messageStreamIsExpanded}
                            setMessageStreamIsExpanded={setMessageStreamIsExpanded}
                        />
                    </div>
                </div>
                
            </div>
        </div>
        <div className='landingPageSection'>
            <div className='landingPageSectionInner'>
                <LandingPageRoadmapTitle
                />
                <div className='landingPageSectionViewportWrapper'>
                    <div className='landingPageSectionMainViewport'>
                        <PlaceholderRoadmap />
                    </div>
                </div>
            </div>
        </div>
        <div className='landingPageSection'>
            <div className='landingPageSectionInner'>
                <LandingPageFeatureTitle />
                <div className='landingPageSectionButtonOuterRow'>
                    <div className='landingPageSectionButtonInnerRow'>
                        <div 
                            className='landingPageFeatureButton'
                            onClick={() => {
                                setLandingPageSearchText("")
                                setLandingPageFeatureOutletToggle(false)
                                setLandingPageDataView('featureRequests')
                                setFeatureDescriptionText("Each search is associated with the 100 most relevant feature requests across all data sources.")
                                setSearchTextIndex(0) 
                                console.log("SEARCHBAR REF", searchBarRef.current)
                                searchBarRef.current.focus()
                            }}
                            >
                            <p className='landingPageFeatureButtonText'>
                                <span className='landingPageFeatureButtonIcon' style={{ fontSize: '22px'}}>
                                    <ImSearch/>
                                </span>
                                Search
                            </p>
                        </div>
                        <div 
                            className='landingPageFeatureButton'
                            onClick={()=>{
                                setLandingPageDataView('clusters')
                                setLandingPageFeatureOutletToggle(false)
                                setFeatureDescriptionText("Click each cluster to focus on it.")
                            }}
                            >
                            <p className='landingPageFeatureButtonText'>
                                <span className='landingPageFeatureButtonIcon'>
                                    <BiNetworkChart />
                                </span> 
                                Cluster
                            </p>
                        </div>
                        <div 
                            className='landingPageFeatureButton' 
                            onClick={()=>{
                                setLandingPageFeatureOutletToggle(false)
                                setLandingPageDataView('filters')
                                setFeatureDescriptionText("Filter by date and author.")
                            }}>
                            <p className='landingPageFeatureButtonText'>
                                <span className='landingPageFeatureButtonIcon'>
                                    <MdOutlineFilterList />
                                </span> 
                                Filter
                            </p>
                        </div>
                        <div 
                            className='landingPageFeatureButton'
                            onClick={() => {
                                setLandingPageFeatureOutletToggle(prevState => !prevState)
                                setFeatureDescriptionText(landingPageFeatureOutletToggle ? "Select a region of the canvas to highlight data points" : "Write rich text notes on pinned feature requests to synthesise takeaways")
                            }}
                            >
                            <p className='landingPageFeatureButtonText'>
                                <span className='landingPageFeatureButtonIcon'>
                                    {landingPageFeatureOutletToggle ? <GoTelescope /> : <BiNotepad />}
                                </span> 
                                {landingPageFeatureOutletToggle ? "Discover" : "Annotate"}
                            </p>
                        </div>
                    </div>
                    <div className='landingPageButtonDescription'>
                        <p className='landingPageButtonDescriptionText'>{featureDescriptionText}</p>
                    </div>
                </div>
                <div className='landingPageSectionViewportWrapper' style={{paddingTop: "10px"}}>
                    <div className='landingPageSectionMainViewport'>
                        <PlaceholderFeature 
                            landingPageDataView={landingPageDataView}
                            landingPageFeatureOutletToggle={landingPageFeatureOutletToggle}
                            landingPageSearchText={landingPageSearchText}
                            landingPageSearchBarRef={searchBarRef}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className='landingPageSection'>
            <div className='landingPageSectionInner'>
                <div className='landingPageSectionViewportWrapper' style={{alignItems: "center", justifyContent: "center"}}>
                <LandingPageWaitListTitle
                    title="Classify and extract feature requests from Discord"
                    leftSide={true}
                    messageStreamIsExpanded={messageStreamIsExpanded}
                    setMessageStreamIsExpanded={setMessageStreamIsExpanded}
                />
                </div>
                
            </div>
        </div>

        <ClientOnly style={{border: "2px solid green"}}>
            {() => (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    border: "2px dashed pink",
                    minHeight: '500%',
                    pointerEvents: "none"
                }}>
                <Canvas
                    gl={{ antialias: true}}
                    camera={{ position: [1.5, 0, 0] }} 
                    style={{pointerEvents: "none"}}
                    linear>
                {/* <OrbitControls /> */}
                <ambientLight />
                <RiverPoints pointsRef={pointsRef} outlineRef={outlineRef}/>
                </Canvas>
                </div>
            )}
        </ClientOnly>
        </>

    )
}