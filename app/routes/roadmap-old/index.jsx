// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useOutletContext } from "@remix-run/react"
import { json } from '@remix-run/node';

// MODELS
import { getAllActiveFeatureRequests } from "~/models/feature-requests.server";
import { authenticator } from "~/models/auth.server.js";

// UTILITIES

// COMPONENTS
import RoadmapPointFieldScaffold from "~/components/RoadmapPointField/RoadmapPointFieldScaffold.js";

// DATA

// STYLES

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const featureRequests = await getAllActiveFeatureRequests(user.id)
  return { data: featureRequests}
}

export default function RoadmapPointField() {
  const loaderData = useLoaderData();
  const context = useOutletContext();
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
  const [zoomObject, setZoomObject] = useState(null)

  useEffect(()=>{
    setTopLevelCanvasDataObj(loaderData.data)
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

  return (
    <RoadmapPointFieldScaffold
      data={topLevelCanvasDataObj}
      zoomObject={zoomObject}
      setZoomObject={setZoomObject}
      resetZoomedData={resetZoomedData}
      hoveredData={context.hoveredData}
      />
  );
}
