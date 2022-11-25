// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useOutletContext } from "@remix-run/react"
import { json } from '@remix-run/node';

// MODELS
import { readFeature } from "~/models/kanban.server"
import { findFeatureRequests } from "~/models/feature-requests.server";
import { authenticator } from "~/models/auth.server.js";

// UTILITIES

// COMPONENTS
import FeatureHeader from "~/components/Header/FeatureHeader"
import PointFieldScaffold from "~/components/PointField/PointFieldScaffold.js";
import MessageStream from "~/components/MessageStream/MessageStream.js"

// DATA

// STYLES

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const featureId = 5
  const feature = await readFeature(featureId)
  const featureRequests = await findFeatureRequests(featureId); // get associated data objects

  return { featureRequests: featureRequests, feature: feature}
}

export async function action({ request }){
  const formData = await request.formData()
  const filterType = formData.get('filterType')
  if(filterType && filterType === 'search'){
    const knnIDs = await embeddingSearch(formData)
    const data = {
      knnIDs: knnIDs,
      filterType: filterType
    }
    return json(data)
  }
}

export default function Field() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])
  const [zoomObject, setZoomObject] = useState(null)

  useEffect(()=>{
    console.log('LOADER DATA', loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("TOP LEVEL STREAM OBJECT", topLevelStreamDataObj)
  }, [topLevelStreamDataObj])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
    if(actionData?.filterType === 'search'){
      if(actionData.knnIDs){
        filterSearchedData(data, actionData.knnIDs, setTopLevelStreamDataObj, setSearchResults)
      }
    }
  }, [actionData])

  function resetSearchData(){
    setTopLevelStreamDataObj(data)
    setSearchResults([])
  }

  useEffect(()=>{
    setTopLevelCanvasDataObj(loaderData.featureRequests.map(a => a.featureRequest))
    setTopLevelStreamDataObj(loaderData.featureRequests)

      }, [loaderData])


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

    const filteredData = loaderData.data.filter(obj => obj[clusterIdName] === zoomObject.id)
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



  return (
    <>
    <FeatureHeader />
    <div className="discoveryPadding">
      <div className='featureDiscoveryWrapper'>
        <div className="discoveryMessageStreamColumn">
          <MessageStream
            data={topLevelStreamDataObj}
            featureId={loaderData.feature.id}
            resetSearchData={resetSearchData}
            zoomObject={zoomObject}
            setZoomObject={setZoomObject}
            />
        </div>
        <div className='discoveryPointComponentsWrapper'>
          <div className='discoverySearchWrapper'>
          </div>
          <div className='discoveryPointFieldWrapper'>
            <PointFieldScaffold
              data={topLevelCanvasDataObj}
              searchResults={searchResults}
              filterBrushedData={filterBrushedData}
              resetBrushFilter={resetBrushFilter}
              zoomObject={zoomObject}
              setZoomObject={setZoomObject}
              resetZoomedData={resetZoomedData}
              />
          </div>
        </div>
    </div>
    </div>
    </>
  );
}
