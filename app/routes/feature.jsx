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
import OutletPlaceholder from "~/components/Feature/OutletPlaceholder";
import { ImSearch } from "react-icons/im"
import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import MessageStream from "~/components/MessageStream/MessageStream.js"
import {IoIosArrowDropdown} from "react-icons/io"

import { GoTelescope } from 'react-icons/go'
import { BiNotepad } from 'react-icons/bi'
import Tooltip from '@mui/material/Tooltip';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

export async function loader({ request, params }){
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/",
    })
    const url = new URL(request.url)
    const searchTerm = url.searchParams.get("searchTerm")
    const clusters = url.searchParams.get("clusters")
  
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

      console.log("KNN IDS:", knnIDs)
  
      // update all feature requests for easier future recall
      const updatedFeatures = await associateFeatureRequestsWithFeature(knnIDs, featureId)
  
      // mark search as completed
      const markedFeature = await updateFeatureIsSearched(featureId)
  
      // // works because of the update above
      // const featureRequests = await findFeatureRequests(featureId)
      return redirect(`/feature/discovery/${featureId}?clusters=True`)
    }
  
    if(feature.isSearched){
      const featureRequests = await findFeatureRequests(featureId); // get associated data objects
      return { feature: feature, featureRequests: featureRequests, clustersLoading: clusters ? true : false}
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
        console.log("HI!!!")
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
    const noResultsFetcher = useFetcher();
    const navigate = useTransition();

    const [zoomObject, setZoomObject] = useState(null)
    const [triggerClusters, setTriggerClusters] = useState(false)
    const [dataView, setDataView] = useState("filters")
    const [expandSpecificCard, setExpandSpecificCard] = useState({cardId: null, cardType: null})
    const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
    const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])
    const [topLevelFilteredData, setTopLevelFilteredData] = useState([])
    const [invisibleFilters, setInvisibleFilters] = useState([])


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

    useEffect(() => {
        if (lastMessage !== null) {
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
      }, [lastMessage, setMessageHistory]);

    useEffect(()=>{
        console.log("LAST MESSAGE:", lastMessage)
    }, [lastMessage])

    // determine if clusters have been processed and update the state
    useEffect(()=>{
            ((loaderData.featureRequests && loaderData.featureRequests[0]?.cluster !== null) 
            ? setClustersGenerated("completed")
            : setClustersGenerated("incomplete"))

            loaderData.clustersLoading && setClustersGenerated('initiated')

            // TODO should we automatically trigger this if clusters are incomplete?
        }, [loaderData.featureRequests])

    // LISTEN TO WEBSOCKET TO FIGURE OUT WHETHER THE CLUSTERS HAVE BEEN GENERATED
    useEffect(()=>{
        if(lastMessage && lastMessage.data){
            const data = JSON.parse(lastMessage.data)

            if(data.type === 'cluster_generation' && data.status === 'initiated'){
                console.log("CLUSTER ANALYSIS INITIALISING")
            }

            else if(data.type === 'cluster_generation' && data.status === 'completed'){
                console.log("CLUSTER ANALYSIS COMPLETED")
                setClustersGenerated("completed")
                
                // reload data to load new clusters
                clusterSubmit({actionType: "reload", featureId: params["*"]}, {method: "post"})

            }
            else if(data.type === 'error' && data.status === 'cluster_generation'){
                setClustersGenerated("error")
            }
            else{
                console.log("UNEXPECTED WEBSOCKET RESPONSE")
            }
        }
        else{
            console.log("NO LAST MESSAGE DATA")
        }
    }, [lastMessage])

    // TITLE EFFECTS
    useEffect(()=>{
        setTitle(loaderData.feature.title)
        setDescription(loaderData.feature.description)
    }, [loaderData])

    useEffect(()=>{
        setTopLevelStreamDataObj(loaderData.featureRequests)
        setTopLevelCanvasDataObj(loaderData.featureRequests)
    }, [loaderData.featureRequests])

    useEffect(()=>{
        if(titleFocused){
            titleRef.current.focus();
        }
    }, [titleFocused])

    useEffect(()=>{
        console.log("TOP LEVEL CANVAS OBJ", topLevelCanvasDataObj)
    }, [topLevelCanvasDataObj])


    useEffect(()=>{
        console.log("TOP LEVEL STREAM OBJ", topLevelStreamDataObj)
    }, [topLevelStreamDataObj])

    useEffect(()=>{
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])

    function handleTitleSearch(){
        fetcher.submit({'searchTerm': title, 'featureId': params["*"], actionType: "featureSearch"}, 
                       {method: "post"})
    }

    useEffect(()=>{
        console.debug("INVISIBLE FILTERS", invisibleFilters)
    }, [invisibleFilters])
   

    useEffect(()=>{
        const filteredData = loaderData.featureRequests.filter(function(fr){
            const filterConditions = []
            for(let filter of loaderData.feature.filters){
                if(filter.type === "date" && !invisibleFilters.includes(filter.filterId)){
                    if(filter.dateVariant === 'before'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isBefore(dayjs(filter.date)))
                    }
                    else if(filter.dateVariant === 'during'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isSame(dayjs(filter.date), 'year'))
                    }
                    else if(filter.dateVariant === 'after'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isAfter(dayjs(filter.date)))
                    }
                    else{
                        console.error("Unexpected Date Variant")
                    }
                }
                else if(filter.type === 'author'){
                    filterConditions.push(fr.featureRequest.author === filter.author)
                }
                else{
                    console.error("Unexpected Filter Type")
                }
            }
            return filterConditions.every(Boolean) 
        })

        setTopLevelStreamDataObj(filteredData)
        setTopLevelCanvasDataObj(filteredData)
        setTopLevelFilteredData(filteredData)

    }, [loaderData.feature, invisibleFilters])

    return(
        <>
        <FeatureHeader />
            <div className="featureScaffold">
                <div className="featureTitleWrapper">
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
                    <button 
                        className='searchIconWrapper'
                        onClick={handleTitleSearch}
                        >
                        <ImSearch 
                            className='searchIconText'
                            style={{
                                width: headerCollapsed ? "20px" : "40px",
                                height: headerCollapsed ? "20px" : "40px",
                            }}/>
                    </button>
                </div>
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
                    value={(description == "" && !descriptionFocused) ? "No Description" : description}
                    onFocus={()=>setDescriptionFocused(true)}
                    onChange={(e)=>setDescription(e.target.value)}
                    />
                
                <descriptionFetcher.Form method='post' style={{height: "0px"}}>
                    <input type='hidden' name='actionType' value='saveDescription' />
                    <input type='hidden' name='featureId' value={params["*"]} />
                    <input type="hidden" name="featureDescription" value={description} />
                    <button className='featureDescriptionSave' type="submit" style={{fontSize: descriptionFocused ? "16px" : "0px"}}>
                        <p onClick={()=>setDescriptionFocused(false)}>Save</p>
                    </button>
                </descriptionFetcher.Form>
    
            <div className='workspaceScaffold'>
                <div className='workspaceOutletScaffold'>
                    <div className='workspaceOutletControls'>
                        <Link to={`/feature/discovery/${params["*"]}`}>
                            <Tooltip title="Discovery" placement='top' arrow>
                                <div className={cn('notepadTab discovery',
                                                    {"notepadTabActive": matches[2] ? matches[2].pathname.includes('discovery') : false}
                                                    )}>
                                    <p className="notepadTabLabel">
                                        <GoTelescope />
                                    </p>
                                </div>
                            </Tooltip>
                        </Link>
                        <Link to={`/feature/notepad/${params["*"]}`}>
                            <Tooltip title="Notepad" placement='top' arrow>
                                <div className={cn('notepadTab writing',
                                                    {"notepadTabActive": matches[2] ? matches[2].pathname.includes('notepad') : false}
                                                    )}>
                                    <p className="notepadTabLabel">
                                        <BiNotepad />
                                    </p>
                                </div>
                            </Tooltip>
                        </Link>
                    </div>
                    <div className='workspaceOutletInnerScaffold'>
                        {(Array.isArray(loaderData.featureRequests) && loaderData.featureRequests.length === 0)
                            ? <OutletPlaceholder isSearched={loaderData.feature.isSearched}/>
                            : <Outlet context={[topLevelCanvasDataObj, topLevelStreamDataObj, setTopLevelCanvasDataObj, setTopLevelStreamDataObj, loaderData, headerCollapsed, zoomObject, setZoomObject, clustersGenerated, triggerClusters, setTriggerClusters, setDataView, setExpandSpecificCard, topLevelFilteredData]}/>
                        }
                    </div>
                </div>
                <div className='messageStreamScaffold'>
                    <div className="messageStreamColumn">
                        <MessageStream
                            data={topLevelStreamDataObj}
                            featureId={loaderData.feature.id}
                            featureTitle={loaderData.feature.title}
                            filters={loaderData.feature.filters}
                            clustersGenerated={clustersGenerated}
                            clusterFetcher={clusterFetcher}
                            setClustersGenerated={setClustersGenerated}
                            setTriggerClusters={setTriggerClusters}
                            setZoomObject={setZoomObject}
                            dataView={dataView}
                            setDataView={setDataView}
                            expandSpecificCard={expandSpecificCard}
                            invisibleFilters={invisibleFilters}
                            setInvisibleFilters={setInvisibleFilters}
                            />
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}
