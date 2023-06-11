// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import Textarea from 'react-expanding-textarea';
import { CgSpinner } from "react-icons/cg"
import { GoSearch } from "react-icons/go"

dayjs.extend(utc)

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useOutletContext, useFetcher, useNavigate, useParams } from "@remix-run/react";
import { json, redirect } from '@remix-run/node';


// MODELS
import { embeddingSearch } from "~/models/embedding-search.server";

// UTILITIES
import { filterSearchedData } from "~/utils/filterSearchedData"

// COMPONENTS
import PointFieldSearch from "~/components/PointField/PointFieldSearch";
import PointFieldScaffold from "~/components/PointField/PointFieldScaffold.js";
import { zoom } from "d3";

export async function action({ request }){
    const formData = await request.formData()
    const filterType = formData.get('filterType')

    if(filterType && filterType === 'search'){
      const searchString = formData.get('searchString');
      const knnIDs = await embeddingSearch(searchString)
      const data = {
        knnIDs: knnIDs,
        filterType: filterType
      }
      return json(data)
    }
  }

export default function Discovery(){
    const actionData = useActionData();
    const [searchResults, setSearchResults] = useState([])
    const [dateValue, setDateValue] = useState(null);
    const searchFetcher = useFetcher();
    const [innerCanvasData, setInnerCanvasData] = useState([]) 
    const fetcher = useFetcher();
    const transition = useNavigate();
    const params = useParams();
   
    const [topLevelCanvasDataObj, topLevelStreamDataObj, 
      setTopLevelCanvasDataObj, setTopLevelStreamDataObj, 
      loaderData, headerCollapsed, zoomObject, setZoomObject,
      clustersGenerated] = useOutletContext();
    

    useEffect(()=>{
        setInnerCanvasData(topLevelCanvasDataObj)
    }, [topLevelCanvasDataObj])
  
    // useEffect(()=>{
    //     const dateFilteredArray = []
    //     if(topLevelStreamDataObj[0]){
    //         for(let fr of loaderData.featureRequests){
    //         if(dayjs.utc(fr.featureRequest.created_at).isAfter(dayjs.utc(dateValue))){
    //             dateFilteredArray.push(fr)
    //         }
    //         }
    //     }
    //     console.log("TOP LEVEL STREAM", topLevelStreamDataObj)
    //     console.log("DATE FILTERED", dateFilteredArray)
    //     setTopLevelStreamDataObj(dateFilteredArray)
    //     setSearchResults(dateFilteredArray.map(a => a.featureRequestId))
    // }, [dateValue])


  useEffect(()=>{
    if(searchFetcher.data && searchFetcher.data.featureRequests){
      const featureRequests = searchFetcher.data.featureRequests;
      setTopLevelStreamDataObj(featureRequests);
      setSearchResults(featureRequests.map(a => a.featureRequestId));
    }
  }, [searchFetcher.data])

  function resetSearchData(){
    setTopLevelStreamDataObj(loaderData.featureRequests)
    setSearchResults([])
  }

  useEffect(()=>{
    if(zoomObject){
      filterZoomedData(zoomObject)
    }
  }, [zoomObject])

  function filterZoomedData(zoomObject){
    let zoomObjectMap = {
      'cluster': "kmeans_labels",
      'regionCluster': 'regionCluster'
    }

    const clusterIdName =  zoomObjectMap[zoomObject.type]
    console.log("FEATURE REQUESTS:", loaderData.featureRequests)
    const filteredData = loaderData.featureRequests.filter(obj => obj["kmeans_labels"] === zoomObject.id)
  }
  
  function resetZoomedData(e, changeParam){
    setZoomObject(null)
  }

  function filterBrushedData(brushedData){
    let dataIds = brushedData.map(a => a.fr_id)

    const filteredData = loaderData.featureRequests.filter(({ featureRequestId}) => dataIds.includes(featureRequestId))
    console.log(filteredData)

    setTopLevelStreamDataObj(filteredData)
  }

  function resetBrushFilter(){
    setTopLevelStreamDataObj(loaderData.featureRequests)
  }

    return(
        <div className='discoveryPointComponentsWrapper'>
            <div className='discoverySearchWrapper'>
            <PointFieldSearch
                searchFetcher={searchFetcher}
                featureId={params["*"]}
                resetSearchData={resetSearchData}
                />
            </div>
            <div className='discoveryPointFieldWrapper'>
            <PointFieldScaffold
                data={innerCanvasData}
                searchResults={searchResults}
                filterBrushedData={filterBrushedData}
                resetBrushFilter={resetBrushFilter}
                zoomObject={zoomObject}
                setZoomObject={setZoomObject}
                resetZoomedData={resetZoomedData}
                dateValue={dateValue}
                setDateValue={setDateValue}
                headerCollapsed={headerCollapsed}
                clustersGenerated={clustersGenerated}
                />
            </div>
      </div>
    )
}