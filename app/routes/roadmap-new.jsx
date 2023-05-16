import { useEffect, useState } from "react";
import { useLoaderData, useActionData, Outlet, useFetcher } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import Header from "~/components/Header/Header";
import Roadmap from "~/components/Roadmap/Roadmap"

import { authenticator } from "~/models/auth.server.js";

import { getFeatures, createFeature, deleteFeature, updateAllFeaturePositions } from "~/models/kanban.server"
import { processCardState } from "~/utils/processCardState"

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const features = await getFeatures(user.id)

  const organisedFeatures = processCardState(features)

  console.log("ORGANISED FEATURES", organisedFeatures)
  return({ features: organisedFeatures })
}

export async function action({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  if(actionType === "create"){
    const columnState = formData.get('columnState')
    const rankState = formData.get('rankState')
    const feature = await createFeature(user.id, columnState, rankState)
    return redirect(`/feature/discovery/${feature.id}`)
  }
  else if(actionType === "delete"){
    const featureId = formData.get('featureId');
    const deletedFeature = await deleteFeature(featureId);
    return ({ deleteFeature })
  }
}

export default function RoadmapRoute(){
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const [hoveredData, setHoveredData] = useState([])
    const hoverFetcher = useFetcher();
  
    useEffect(()=>{
      if(hoverFetcher.data){
        setHoveredData(hoverFetcher.data.featureRequests)
      }
    }, [hoverFetcher.data])
  
    function updateHoveredData(event, featureId){
      if(featureId){
        hoverFetcher.submit({actionType: 'hover', featureId: featureId}, {method: 'get', action: "utils/hover-feature-requests"})
      }
      else{
        setHoveredData([])
      }
    }

    return(
        <>
            <Header />
            <div className='roadmapWrapper'>
                <div className='innerRoadmapWrapper'>
                    <Roadmap features={loaderData.features}
                             updateHoveredData={updateHoveredData} />
                </div>
                <div className='roadmapTagsWrapper'>

                </div>
                <div className='roadmapOutletWrapper'>
                    <Outlet context={{ hoveredData: hoveredData }}/>
                </div>
            </div>
        </>
    )
}