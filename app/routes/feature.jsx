// REACT-REMIX IMPORTS
import { useState, useRef, useEffect } from "react";

import { redirect } from "@remix-run/node"
import { useLoaderData, useActionData, Form, useFetcher, useNavigate, useTransition, useSubmit, useRevalidator } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import ContentEditable from 'react-contenteditable';
import LinearProgress from '@mui/material/LinearProgress';
import useWebSocket, { ReadyState } from "react-use-websocket";

// MODULE IMPORTS
import { authenticator } from "~/models/auth.server.js";
import { readFeature, updateFeatureTitle, updateFeatureIsSearched, updateFeatureDescription } from "~/models/kanban.server"
import { findFeatureRequests, associateFeatureRequestsWithFeature } from "~/models/feature-requests.server"
import { embeddingSearch, generateSearchVector, initialiseClusterAnalysis } from "~/models/embedding-search.server"

import FeatureHeader from "~/components/Header/FeatureHeader";
import { ImSearch } from "react-icons/im"
import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import MessageStream from "~/components/MessageStream/MessageStream.js"
import {IoIosArrowDropdown} from "react-icons/io"

export async function loader({ request, params }){
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/",
    })
    const url = new URL(request.url)
    const searchTerm = url.searchParams.get("searchTerm")
  
    const featureId = params["*"]
    const feature = await readFeature(featureId)
  
    // make sure the right user is looking at the feature information
    if(feature.userId !== user.id){
      return redirect("/")
    }
  
    if(searchTerm){
      // update feature title
      const updatedFeature = await updateFeatureTitle(featureId, searchTerm)
  
      // conduct search
      const knnIDs = await embeddingSearch(searchTerm, featureId); // get sorted scores
  
      // update all feature requests for easier future recall
      const updatedFeatures = await associateFeatureRequestsWithFeature(knnIDs, featureId)
  
      // mark search as completed
      const markedFeature = await updateFeatureIsSearched(featureId)
  
      // // works because of the update above
      // const featureRequests = await findFeatureRequests(featureId)
      return redirect(`/feature/discovery/${featureId}`)
    }
  
    if(feature.isSearched){
      const featureRequests = await findFeatureRequests(featureId); // get associated data objects
      return { feature: feature, featureRequests: featureRequests}
    }
  
    return { feature: feature, featureRequests: [] }
  }
  
  export async function action({ request }){
    const formData = await request.formData()
    const actionType = formData.get('actionType')
  
    if(actionType === 'featureSearch'){
        const featureId = formData.get("featureId")
        const searchTerm = formData.get('searchTerm')
      return redirect(`/feature/discovery/${featureId}?searchTerm=${searchTerm}`)
    }
    else if(actionType === "saveDescription"){
        const featureId = formData.get("featureId")
        const featureDescription = formData.get('featureDescription')

        const updatedFeature = await updateFeatureDescription(featureId, featureDescription)   
        return {updatedFeature}
    }
    else if(actionType === 'reload'){
        const featureId = formData.get("featureId")
        return redirect(`/feature/discovery/${featureId}`)
    }
  }

export default function Feature(){
    const titleRef = useRef();
    const [titleFocused, setTitleFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [headerCollapsed, setHeaderCollapsed] = useState(false);

    const [description, setDescription] = useState("No description")
    const [title, setTitle] = useState("")
    const params = useParams();
    const matches = useMatches();

    const loaderData = useLoaderData();
    const actionData = useActionData();
    const fetcher = useFetcher();
    const descriptionFetcher = useFetcher();
    const navigate = useTransition();

    const [zoomObject, setZoomObject] = useState(null)

    const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
    const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])

    const clusterSubmit = useSubmit();
    const clusterFetcher = useFetcher();

    const [clustersGenerated, setClustersGenerated] = useState("incomplete")

    const [socketUrl, setSocketUrl] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(()=>{
        setSocketUrl(window.ENV.WEBSOCKETS_URL)
      }, [])

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(()=>{
        console.log("CONNECTION STATUS:", connectionStatus)
    }, [connectionStatus])

    useEffect(() => {
        if (lastMessage !== null) {
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
      }, [lastMessage, setMessageHistory]);

    
    // determine if clusters have been processed and update the state
    useEffect(()=>{
        (
            (loaderData.featureRequests && loaderData.featureRequests[0].cluster != -1) 
            ? setClustersGenerated("completed")
            : setClustersGenerated("incomplete")

            // TODO should we automatically trigger this if clusters are incomplete?
        )
    }, [loaderData])

    // LISTEN TO WEBSOCKET TO FIGURE OUT WHETHER THE CLUSTERS HAVE BEEN GENERATED
    useEffect(()=>{
        console.log("INNER LAST MESSAGE!", lastMessage)
        if(lastMessage && lastMessage.data){
            console.log("LAST MESSAGE DATA!", lastMessage.data)
            const data = JSON.parse(lastMessage.data)

            if(data.type === 'cluster_generation' && data.status === 'initiated'){
                console.log("CLUSTER ANALYSIS INITIALISING")
                setClustersGenerated("initiated")
            }
            else if(data.type === 'cluster_generation' && data.status === 'completed'){
                console.log("CLUSTER ANALYSIS COMPLETED")
                setClustersGenerated("completed")
                
                // reload data to load new clusters
                clusterSubmit({actionType: "reload", featureId: params["*"]}, {method: "post"})

            }
            else{
                console.log("UNEXPECTED WEBSOCKET RESPONSE")
            }
        }
        else{
            console.log("NO LAST MESSAGE DATA")
        }
    }, [lastMessage])

    useEffect(()=>{
        console.log("CLUSTERS GENERATED?", clustersGenerated)
    }, [clustersGenerated])

    // TITLE EFFECTS
    useEffect(()=>{
        setTitle(loaderData.feature.title)
        setDescription(loaderData.feature.description)
    }, [loaderData])

    useEffect(()=>{
        setTopLevelStreamDataObj(loaderData.featureRequests)
        setTopLevelCanvasDataObj(loaderData.featureRequests.map(a => ({...a.featureRequest, cluster: a.cluster})))
    }, [loaderData.featureRequests])

    useEffect(()=>{
        if(titleFocused){
            titleRef.current.focus();
        }
    }, [titleFocused])

    useEffect(()=>{
        console.log("CANVAS OBJ", topLevelCanvasDataObj)
    }, [topLevelCanvasDataObj])

    return(
        <>
        <FeatureHeader />
            <div className="featureScaffold">
                <fetcher.Form className="featureTitleWrapper" method='post'>
                    {titleFocused
                     ? (
                        <>
                            <input className='featureTitleInnerInput' 
                            onBlur={()=>setTitleFocused(false)}
                            placeholder={"Enter a Feature Description"}
                            defaultValue={title == "Untitled" ? null : title}
                            data-gramm="false"
                            style={{fontSize: headerCollapsed ? "24px" : "40px"}}
                            ref={titleRef}
                            onChange={(e)=>setTitle(e.target.value)}
                            data-gramm_editor="false"
                            data-enable-grammarly="false"
                            />
                            
                        </>
                     )
                     : (
                        <div 
                            className='featureTitleInnerWrapper' 
                            onClick={()=>setTitleFocused(true)} 
                            > 
                            <h1 className='featureTitleText' 
                                style={{fontSize: headerCollapsed ? "24px" : "40px"}}>{title} {title && <span>/</span>} <span style={{color: "#B0BFB9", textTransform: "capitalize"}}>{title && matches[2].pathname.split("/")[2]}</span></h1>
                        </div>
                     )
                    }
                    <div 
                        className='featureDropDownArrow' 
                        onClick={()=>setHeaderCollapsed(prevState => !prevState)}
                        style={{
                            transform: headerCollapsed ? "rotate(0deg)" : "rotate(180deg)",
                            height: headerCollapsed ? "22px" : "30px",
                            width: headerCollapsed ? "22px" : "30px",
                            top: headerCollapsed ? "2px" : "7.5px",
                            left: headerCollapsed ? "-24px" : "-36px",
                               }}>
                            <IoIosArrowDropdown color="#B0BFB9"/>
                    </div>
                    <div style={{flex: 1}}/>
                    <input type='hidden' name='searchTerm' value={title} />
                    <input type='hidden' name='featureId' value={params["*"]}/>
                    <input type='hidden' name='actionType' value='featureSearch' />
                    <button className='searchIconWrapper'>
                        <ImSearch 
                            className='searchIconText'
                            style={{
                                width: headerCollapsed ? "20px" : "40px",
                                height: headerCollapsed ? "20px" : "40px",
                            }}/>
                    </button>
                </fetcher.Form>
                {navigate.type === "fetchActionRedirect" &&
                    <LinearProgress 
                        variant="indeterminate"
                        style={{width: "100%", 
                                height: "2px", 
                                backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                    />
                }
    
                <div className="pinnedMessagesWrapper" style={{fontSize: headerCollapsed ? "0px" : "18px"}}>
                    <p className='pinnedMessagesText'><em>{loaderData.feature._count.featureRequests} pinned {(loaderData.feature._count.featureRequests == 1) ? <span>message</span> : <span>messages</span>}</em></p>
                </div>
                <textarea 
                    style={{
                        fontSize: headerCollapsed ? "0px" : "16px",
                        height: headerCollapsed ? "0px" : "50px",
                    }}
                    className='featureDescriptionWrapper' 
                    defaultValue={"No Description"}
                    value={description == "" ? null : description}
                    onFocus={()=>setDescriptionFocused(true)}
                    onBlur={()=>setDescriptionFocused(false)}
                    onChange={(e)=>setDescription(e.target.value)}
                    />
                
                <descriptionFetcher.Form method='post' style={{height: "0px"}}>
                    <input type='hidden' name='actionType' value='saveDescription' />
                    <input type='hidden' name='featureId' value={params["*"]} />
                    <input type="hidden" name="featureDescription" value={description} />
                    {descriptionFocused &&
                        <button className='featureDescriptionSave' type='submit'>
                            <p>Save</p>
                        </button>
                    }
                </descriptionFetcher.Form>
    
            <div className='workspaceScaffold'>
                <div className='workspaceOutletScaffold'>
                    <div className='workspaceOutletControls'>
                        <Link to={`/feature/discovery/${params["*"]}`}>
                            <div className={cn('notepadTab discovery',
                                                {"notepadTabActive": matches[2] ? matches[2].pathname.includes('discovery') : false}
                                                )}>
                                <p className="notepadTabLabel">Discovery</p>
                            </div>
                        </Link>
                        <Link to={`/feature/notepad/${params["*"]}`}>
                            <div className={cn('notepadTab writing',
                                                {"notepadTabActive": matches[2] ? matches[2].pathname.includes('notepad') : false}
                                                )}>
                                <p className="notepadTabLabel">Notepad</p>
                            </div>
                        </Link>
                    </div>
                    <div className='workspaceOutletInnerScaffold'>
                        <Outlet context={[topLevelCanvasDataObj, topLevelStreamDataObj, setTopLevelCanvasDataObj, setTopLevelStreamDataObj, loaderData, headerCollapsed, zoomObject, setZoomObject]}/>
                    </div>
                </div>
                <div className='messageStreamScaffold'>
                    <div className="messageStreamColumn">
                        <MessageStream
                            data={topLevelStreamDataObj}
                            featureId={loaderData.feature.id}
                            featureTitle={loaderData.feature.title}
                            clustersGenerated={clustersGenerated}
                            clusterFetcher={clusterFetcher}
                            setClustersGenerated={setClustersGenerated}
                            
                            />
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
