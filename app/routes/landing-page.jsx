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
import { SocialsProvider } from "remix-auth-socials";

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

import { Fade } from "react-awesome-reveal";
import { useSubmit } from "@remix-run/react";

const fullSearchText = "Whiteboard"
const searchTextDelay = 10

export default function LandingPage(){
    const pointsRef = useRef();
    const outlineRef = useRef();
    const searchBarRef = useRef();
    const scrollRef = useRef();

    const submit = useSubmit();

    const [messageStreamIsExpanded, setMessageStreamIsExpanded] = useState(false)

    const [landingPageDataView, setLandingPageDataView] = useState("featureRequests")
    const [landingPageFeatureOutletToggle, setLandingPageFeatureOutletToggle] = useState(false)
    const [landingPageSearchText, setLandingPageSearchText] = useState("")
    const [searchTextIndex, setSearchTextIndex] = useState(-1);
    const [featureDescriptionText, setFeatureDescriptionText] = useState("")
    const [titleHovered, setTitleHovered] = useState(false)

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
            <div className='landingPageLogoWrapper'>
                <Fade>
                    <h1 className='landingPageLogo' 
                        onPointerOver={()=>setTitleHovered(true)}
                        onPointerOut={()=>setTitleHovered(false)}
                        onClick={()=>submit(null, {method: "post", "action": `/auth/${SocialsProvider.GOOGLE}`})}
                        >
                    <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
                    Terrarium
                    </h1>
                </Fade>
            </div>
            <div className='terrariumTagline'>
                <Fade delay={150}>
                    <p className='landingPageLoginText' onClick={() => submit(null, {method: "post", "action": `/auth/${SocialsProvider.GOOGLE}`})
                    }>Log In</p>
                </Fade>
            </div>
        </div>
        <div className='landingPageHook' onClick={()=>{
            scrollRef.current?.scrollIntoView({behavior: "smooth"})
        }}>
            <Fade delay={300} triggerOnce={true}>
                <p className='landingPageHookText'>What's Terrarium?</p>
            </Fade>
        </div>
             </>

    )
}


//   DATA SOURCES
//         <div className='landingPageSection' ref={scrollRef} style={{paddingTop: "30px", border: '1px solid #e7e7e7'}}>
//             <div className='landingPageSectionInner'>
//                 <Fade fraction={1} delay={100} triggerOnce={true}>
//                     <LandingPageMovingTitle
//                         title="Classify and extract feature requests from Discord"
//                     />
//                 </Fade>
//                 <Fade fraction={0.1} delay={300} triggerOnce={true}>
//                     <div className='landingPageSectionViewportWrapper' style={{marginTop: "40px", height: '95%'}}>
//                         <div className='pageTitleDescription'>
//                             <p className='pageTitleDescriptionText'>Mouse over elements for more information</p>
//                         </div>
//                         <div className='landingPageSectionMainViewport'>
//                                 <PlaceholderDataSources />
//                         </div>
//                     </div>
//                 </Fade>
//             </div>
//         </div>
//         {/* MESSAGE STREAM */}
//         <div className='landingPageSection' style={{borderBottom: "1px solid #e7e7e7"}}>
//             <div className='landingPageSectionInner'>
//                 <div className='landingPageSectionViewportWrapper' style={{alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
//                 <LandingPageMessageStreamTitle 
//                     title="Classify and extract feature requests from Discord"
//                     leftSide={true}
//                     messageStreamIsExpanded={messageStreamIsExpanded}
//                     setMessageStreamIsExpanded={setMessageStreamIsExpanded}
//                 />
//                 <Fade className='landingPageSectionMainViewport' delay={600} triggerOnce={true}
//                     style={{
//                         display: "flex", 
//                         justifyContent: "center", 
//                         flex: "0.8",
//                         padding: "20px",
//                         paddingTop: "5px",
//                         }}>
//                     <PlaceholderMessageStream 
//                         messageStreamIsExpanded={messageStreamIsExpanded}
//                         setMessageStreamIsExpanded={setMessageStreamIsExpanded}
//                     />
//                 </Fade>
//                 </div>

                
//             </div>
//         </div>
//         {/* ROADMAP */}
//         <div className='landingPageSection' style={{borderBottom: "1px solid #e7e7e7"}}>
//             <div className='landingPageSectionInner' style={{marginTop: "60px"}}>
//                 <Fade fraction={0.5} triggerOnce={true}>
//                     <LandingPageRoadmapTitle />
//                 </Fade>
//                 <div className='landingPageSectionViewportWrapper' style={{marginTop: "30px"}}>
//                     <Fade className='landingPageSectionMainViewport' triggerOnce={true} style={{border: "unset", boxShadow: "unset"}} delay={300}>
//                         <PlaceholderRoadmap />
//                     </Fade>
//                 </div>
//             </div>
//         </div>
//         <div className='landingPageSection' 
//             style={{
//                     paddingTop: "60px", 
//                     height: "120vh",
//                     border: '2px solid #e7e7e7',
//                     }}>
//             <div className='landingPageSectionInner'>
//                 <Fade fraction={0.5} triggerOnce={true}>
//                     <LandingPageFeatureTitle />
//                 </Fade>
//                 <Fade className='landingPageSectionButtonOuterRow' triggerOnce={true} fraction={0.3} delay={300}>
//                     <div className='landingPageSectionButtonInnerRow'>
//                         <div 
//                             className='landingPageFeatureButton'
//                             onClick={() => {
//                                 setLandingPageSearchText("")
//                                 setLandingPageFeatureOutletToggle(false)
//                                 setLandingPageDataView('featureRequests')
//                                 setFeatureDescriptionText("Each search is associated with the 100 most relevant feature requests across all data sources.")
//                                 setSearchTextIndex(0) 
//                                 console.log("SEARCHBAR REF", searchBarRef.current)
//                                 searchBarRef.current.focus()
//                             }}
//                             >
//                             <p className='landingPageFeatureButtonText'>
//                                 <span className='landingPageFeatureButtonIcon' style={{ fontSize: '22px'}}>
//                                     <ImSearch/>
//                                 </span>
//                                 Search
//                             </p>
//                         </div>
//                         <div 
//                             className='landingPageFeatureButton'
//                             onClick={()=>{
//                                 setLandingPageDataView('clusters')
//                                 setLandingPageFeatureOutletToggle(false)
//                                 setFeatureDescriptionText("Click each cluster to focus on it.")
//                             }}
//                             >
//                             <p className='landingPageFeatureButtonText'>
//                                 <span className='landingPageFeatureButtonIcon'>
//                                     <BiNetworkChart />
//                                 </span> 
//                                 Cluster
//                             </p>
//                         </div>
//                         <div 
//                             className='landingPageFeatureButton' 
//                             onClick={()=>{
//                                 setLandingPageFeatureOutletToggle(false)
//                                 setLandingPageDataView('filters')
//                                 setFeatureDescriptionText("Filter by date and author.")
//                             }}>
//                             <p className='landingPageFeatureButtonText'>
//                                 <span className='landingPageFeatureButtonIcon'>
//                                     <MdOutlineFilterList />
//                                 </span> 
//                                 Filter
//                             </p>
//                         </div>
//                         <div 
//                             className='landingPageFeatureButton'
//                             onClick={() => {
//                                 setLandingPageFeatureOutletToggle(prevState => !prevState)
//                                 setFeatureDescriptionText(landingPageFeatureOutletToggle ? "Select a region of the canvas to highlight data points" : "Write rich text notes on pinned feature requests to synthesise takeaways")
//                             }}
//                             >
//                             <p className='landingPageFeatureButtonText'>
//                                 <span className='landingPageFeatureButtonIcon'>
//                                     {landingPageFeatureOutletToggle ? <GoTelescope /> : <BiNotepad />}
//                                 </span> 
//                                 {landingPageFeatureOutletToggle ? "Discover" : "Annotate"}
//                             </p>
//                         </div>
//                     </div>
//                     <div className='landingPageButtonDescription'>
//                        {featureDescriptionText && <Fade duration={400}><p className='landingPageButtonDescriptionText'>{featureDescriptionText}</p></Fade>}
//                     </div>
//                 </Fade>
//                 <div className='landingPageSectionViewportWrapper' style={{paddingTop: "10px", height: "70%"}}>
//                     <Fade className='landingPageSectionMainViewport' delay={600} triggerOnce={true} fraction={0.3}>
//                         <PlaceholderFeature 
//                             landingPageDataView={landingPageDataView}
//                             landingPageFeatureOutletToggle={landingPageFeatureOutletToggle}
//                             landingPageSearchText={landingPageSearchText}
//                             landingPageSearchBarRef={searchBarRef}
//                         />
//                     </Fade>
//                 </div>
//             </div>
//         </div>
//         <div className='landingPageSection' style={{ marginTop: "60px"}}>
//             <div className='landingPageSectionInner' style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
//                 <div className='landingPageSectionViewportWrapper' style={{alignItems: "center", justifyContent: "center"}}>
//                 <LandingPageWaitListTitle
//                     title="Classify and extract feature requests from Discord"
//                     leftSide={false}
//                     messageStreamIsExpanded={messageStreamIsExpanded}
//                     setMessageStreamIsExpanded={setMessageStreamIsExpanded}
//                 />
//                 </div>
//             </div>
//         </div>

//         <ClientOnly style={{border: "2px solid green"}}>
//             {() => (
//                 <div style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     bottom: 0,
//                     right: 0,
//                     minHeight: '650%',
//                     pointerEvents: "none",
//                     transition: 'all 0.2s ease-in-out',
//                 }}>
//                 {/* <Canvas
//                     gl={{ antialias: true}}
//                     camera={{ position: [1.5, 0, 0] }} 
//                     style={{pointerEvents: "none"}}
//                     linear>
//                 <ambientLight />
//                 <RiverPoints 
//                     pointsRef={pointsRef} 
//                     outlineRef={outlineRef}
//                     titleHovered={titleHovered}
//                     />
//                 </Canvas> */}
//                 </div>
//             )}
//         </ClientOnly>
 