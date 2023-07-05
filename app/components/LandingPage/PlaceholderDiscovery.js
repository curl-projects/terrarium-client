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

import PointFieldScaffold from "~/components/PointField/PointFieldScaffold.js";

export default function PlaceholderDiscovery({topLevelCanvasDataObj, topLevelStreamDataObj, setTopLevelCanvasDataObj, setTopLevelStreamDataObj, loaderData, headerCollapsed, zoomObject, setZoomObject, clustersGenerated, triggerClusters, setTriggerClusters, setDataView, setExpandSpecificCard, topLevelFilteredData}){
    const actionData = useActionData();
    const [innerCanvasData, setInnerCanvasData] = useState([]) 
    const fetcher = useFetcher();
    const transition = useNavigate();
    const params = useParams();
   
    // const [topLevelCanvasDataObj, topLevelStreamDataObj, setTopLevelCanvasDataObj, setTopLevelStreamDataObj, loaderData, headerCollapsed, zoomObject, setZoomObject, clustersGenerated, triggerClusters, setTriggerClusters, setDataView, setExpandSpecificCard, topLevelFilteredData] = useOutletContext();

    useEffect(()=>{
        setInnerCanvasData(topLevelCanvasDataObj)
    }, [topLevelCanvasDataObj])

  
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
            <div className='discoveryPointFieldWrapper'>
            <PointFieldScaffold
                data={innerCanvasData}
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
                placeholder={true}
                />
            </div>
      </div>
    )
}