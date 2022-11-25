// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData} from "@remix-run/react"
import { json } from '@remix-run/node';

// MODELS
import { getAllActiveFeatureRequests } from "~/models/feature-requests.server";
import { authenticator } from "~/models/auth.server.js";

// UTILITIES
import { manipulateInputData } from "~/utils/manipulateInputData.js"

// COMPONENTS
import RoadmapPointFieldScaffold from "~/components/RoadmapPointField/RoadmapPointFieldScaffold.js";

// DATA
import d from "~/mock-data/final_output.json"

// STYLES
import experimentOneStylesheetUrl from "~/styles/experimentOne.css"

export const links = () => {
  return [
    { rel: "stylesheet", href: experimentOneStylesheetUrl}
  ]
}

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const featureRequests = await getAllActiveFeatureRequests(user.id)
  return { data: featureRequests}
}

export default function RoadmapPointField() {
  const loaderData = useLoaderData();
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(loaderData.data)
  const [zoomObject, setZoomObject] = useState(null)

  useEffect(()=>{
    console.log("LOADER DATA:", loaderData)
      }, [loaderData])


  useEffect(()=>{
    if(zoomObject){
      filterZoomedData(zoomObject)
    }
  }, [zoomObject])

  // function filterBrushedData(brushedData){
  //   let dataIds = brushedData.map(a => a.fr_id)
  //   const filteredData = data.filter(({fr_id}) => dataIds.includes(fr_id))
  // }


  function filterZoomedData(zoomObject){
    let zoomObjectMap = {
      'cluster': "kmeans_labels",
      'regionCluster': 'regionCluster'
    }

    const clusterIdName =  zoomObjectMap[zoomObject.type]

    const filteredData = loaderData.filter(obj => obj[clusterIdName] === zoomObject.id)
    setTopLevelStreamDataObj(filteredData)
  }

  function resetZoomedData(e, changeParam){
    setZoomObject(null)
  }

  return (
    <div className="pageWrapper">
      <div className="canvasWrapper">
        <RoadmapPointFieldScaffold
          data={topLevelCanvasDataObj}
          // filterBrushedData={filterBrushedData}
          // resetBrushFilter={resetBrushFilter}
          zoomObject={zoomObject}
          setZoomObject={setZoomObject}
          resetZoomedData={resetZoomedData}
          />
      </div>
    </div>
  );
}
