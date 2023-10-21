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

import Header from "~/components/Header/Header";
import OutletPlaceholder from "~/components/Feature/OutletPlaceholder";
import { ImSearch } from "react-icons/im"
import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import ExampleDataset from "~/components/Datasets/ExampleDataset";
import { Fade } from "react-awesome-reveal";

import MessageStream from "~/components/MessageStream/MessageStream.js"
import {IoIosArrowDropdown} from "react-icons/io"

import { GoTelescope } from 'react-icons/go'
import { BiNotepad } from 'react-icons/bi'
import Tooltip from '@mui/material/Tooltip';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import * as d3 from 'd3';
import { getDatasets, updateFeatureDatasets } from "~/models/dataset-manipulation.server";

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
    const datasets = await getDatasets(user.id)
  
    // make sure the right user is looking at the feature information
    if(feature.userId !== user.id){
      return redirect("/")
    }
  
    if(searchTerm){
    const selectedDatasets = url.searchParams.get("selectedDatasets")

      // update feature title
      const updatedFeature = await updateFeatureTitle(featureId, searchTerm)
      
      const updatedDatasets = await updateFeatureDatasets(featureId, selectedDatasets.split(','))
  
      // conduct search
    //   TODO: change user id to dataset id
      const {knnIDs, pipelineResponse} = await embeddingSearch(searchTerm, featureId, user.id, selectedDatasets.split(',')); // get sorted scores

      console.log("PIPELINE RESPONSE:", pipelineResponse)
  
      // update all feature requests for easier future recall
      const updatedFeatures = await associateFeatureRequestsWithFeature(knnIDs, featureId)
  
      // mark search as completed
      const markedFeature = await updateFeatureIsSearched(featureId)
  
      // // works because of the update above
      // const featureRequests = await findFeatureRequests(featureId)
      return redirect(`/feature/discovery/${featureId}?clusters=${pipelineResponse}`)
    }
  
    if(feature.isSearched){
      const  featureRequests = await findFeatureRequests(featureId); // get associated data objects
      return { feature: feature, featureRequests: featureRequests, clusters: clusters, datasets: datasets}
    }
  
    return { feature: feature, featureRequests: [], datasets: datasets }
  }
  
  export async function action({ request }){
    const formData = await request.formData()
    const actionType = formData.get('actionType')
  
    if(actionType === 'featureSearch'){
        const featureId = formData.get("featureId")
        const searchTerm = formData.get('searchTerm')
        const selectedDatasets = formData.get('selectedDatasets')
      return redirect(`/feature/discovery/${featureId}?searchTerm=${searchTerm}&selectedDatasets=${selectedDatasets}`)
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
    const noResultsFetcher = useFetcher();
    const navigate = useTransition();

    const [zoomObject, setZoomObject] = useState(null)
    const [triggerClusters, setTriggerClusters] = useState(false)
    const [dataView, setDataView] = useState("featureRequests")
    const [expandSpecificCard, setExpandSpecificCard] = useState({cardId: null, cardType: null})
    const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
    const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])
    const [topLevelFilteredData, setTopLevelFilteredData] = useState([])
    const [invisibleFilters, setInvisibleFilters] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [selectedDatasets, setSelectedDatasets] = useState([])

    const clusterSubmit = useSubmit();
    const clusterFetcher = useFetcher();

    const [clustersGenerated, setClustersGenerated] = useState("incomplete")

    const [socketUrl, setSocketUrl] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(()=>{
        setTitleFocused(false)
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])


    useEffect(()=>{
        setSocketUrl(window.ENV.WEBSOCKETS_URL)
      }, [])

    useEffect(()=>{
        console.log("CLUSTER FETCHER DATA", clusterFetcher.data)
        String(clusterFetcher.data?.clusterResponse) === '404' && setClustersGenerated('error')
    }, [clusterFetcher.data])

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

            loaderData.clusters === '202' && setClustersGenerated('initiated')
            loaderData.clusters === '404' && setClustersGenerated('error')

            // TODO should we automatically trigger this if clusters are incomplete?
        }, [loaderData.featureRequests])

    // LISTEN TO WEBSOCKET TO FIGURE OUT WHETHER THE CLUSTERS HAVE BEEN GENERATED
    useEffect(()=>{
        if(lastMessage && lastMessage.data){
            const data = JSON.parse(lastMessage.data)

            if(data.type === 'cluster_generation' && data.status === 'initiated'){
                console.log("CLUSTER ANALYSIS INITIALISING")
                setClustersGenerated('initiated')
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
        console.log("TITLE FOCUSED:", titleFocused)
        if(titleFocused){
            titleRef.current.focus();
        }
    }, [titleFocused])


    function handleTitleSearch(){
        fetcher.submit({'searchTerm': title, 'featureId': params["*"], actionType: "featureSearch", selectedDatasets: selectedDatasets}, 
                       {method: "post"})
    }

    useEffect(()=>{
        if(searchText){
            setSearchResults(topLevelFilteredData.filter(x => x.featureRequest.fr.toLowerCase().includes(searchText.toLowerCase())).map(fr => fr.featureRequest.fr_id))
            setTopLevelStreamDataObj(topLevelFilteredData.filter(x => x.featureRequest.fr.toLowerCase().includes(searchText.toLowerCase())))
            
        }
        else{
            setSearchResults([])
            setTopLevelStreamDataObj(topLevelFilteredData)
        }
    }, [searchText])

    useEffect(()=>{
        console.log("SEARCH RESULTS", searchResults)
        d3.selectAll(".frNode")
          .classed("invisibleFrNode", false)

        if(searchText){
            d3.selectAll(".frNode").classed("invisibleFrNode", true)

            for(let fr_id of searchResults){
                d3.select(`#fr-${fr_id}`)
                  .classed("invisibleFrNode", false)
            }
        }
    }, [searchResults])
   

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
        <div className='featurePageWrapper'>
            <Header 
                headerCollapsed={headerCollapsed}
                />
            <div className="featureTitleScaffold" ref={titleRef}>
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
                    {titleFocused && title !== "" && selectedDatasets.length > 0 &&
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
                    }
                </div>
                {navigate.type === "fetchActionRedirect" &&
                    <LinearProgress 
                        variant="indeterminate"
                        style={{width: "100%", 
                                height: "2px", 
                                backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                    />
                }
                {titleFocused && title !== "" &&
                            <>  
                                <div className='featureSearchDatasetSelectorOuter'>
                                    <div className="featureSearchDatasetSelector">
                                        {loaderData.datasets.map((dataset, index)=>
                                                <ExampleDataset 
                                                    title={dataset.readableName}
                                                    uniqueFileName={dataset.uniqueFileName}
                                                    key={dataset.datasetId}
                                                    selected={selectedDatasets.includes(dataset.uniqueFileName)}
                                                    selectedDatasets={selectedDatasets}
                                                    setSelectedDatasets={setSelectedDatasets}
                                                />
                                            )}
                                    </div>
                                </div>
                            </>
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
            </div>
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
                            searchText={searchText}
                            setSearchText={setSearchText}
                            />
                    </div>
                </div>
            </div>
            <div style={{gridRow: "2 / 5", gridColumn: "3"}}></div>
            </div>

    )
}
