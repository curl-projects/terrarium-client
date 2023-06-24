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
    const searchFetcher = useFetcher();
    const [innerCanvasData, setInnerCanvasData] = useState([]) 
    const fetcher = useFetcher();
    const transition = useNavigate();
    const params = useParams();
   
    const [topLevelCanvasDataObj, topLevelStreamDataObj, setTopLevelCanvasDataObj, setTopLevelStreamDataObj, loaderData, headerCollapsed, zoomObject, setZoomObject, clustersGenerated, triggerClusters, setTriggerClusters, setDataView, setExpandSpecificCard, topLevelFilteredData] = useOutletContext();

    useEffect(()=>{
        setInnerCanvasData(topLevelCanvasDataObj)
    }, [topLevelCanvasDataObj])

  // SEARCHING
  useEffect(()=>{
    if(searchFetcher.data && searchFetcher.data.featureRequests){
      const featureRequests = searchFetcher.data.featureRequests;
      setTopLevelStreamDataObj(featureRequests);
      setSearchResults(featureRequests.map(a => a.featureRequestId));
    }
  }, [searchFetcher.data])


  function resetSearchData(){
    setTriggerFilters(s => !s)
    setSearchResults([])
  }
  
  function resetZoomedData(e, changeParam){
    setZoomObject(null)
  }

  function filterBrushedData(brushedData){
    let dataIds = brushedData.map(a => a.featureRequestId)
    const filteredData = loaderData.featureRequests.filter(({ featureRequestId }) => dataIds.includes(featureRequestId))
    setTopLevelStreamDataObj(filteredData)
  }

  function resetBrushFilter(){
    setTopLevelStreamDataObj(topLevelFilteredData)
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
                headerCollapsed={headerCollapsed}
                clustersGenerated={clustersGenerated}
                triggerClusters={triggerClusters}
                setTriggerClusters={setTriggerClusters}
                setDataView={setDataView}
                setExpandSpecificCard={setExpandSpecificCard}
                />
            </div>
      </div>
    )
}