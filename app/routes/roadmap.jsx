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
    console.log("CREATED FEATURE:", `/feature/notepad/${feature.id})`)
    return redirect(`/feature/notepad/${feature.id}`)
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

  useEffect(() => {
    console.log("HOVERED_DATA:", hoveredData)
  }, [hoveredData])

  useEffect(()=>{
    if(hoverFetcher.data){
      console.log("UPDATED!")
      setHoveredData(hoverFetcher.data.featureRequests)
    }
    else{
    }
  }, [hoverFetcher.data])

  function updateHoveredData(event, featureId){
    console.log("FEATUREID", featureId)
    if(featureId){
      console.log("HI!")
      hoverFetcher.submit({actionType: 'hover', featureId: featureId}, {method: 'get', action: "utils/hover-feature-requests"})
    }
    else{
      setHoveredData([])
    }
  }

  useEffect(()=>{
    console.log("LOADER DATA:", loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <>
      <Header />
      <div className="roadmapWrapper">
        <Roadmap features={loaderData.features}
                 updateHoveredData={updateHoveredData} />
          <div className='pointFieldWrapper'>
            <Outlet context={{ hoveredData: hoveredData }}/>
          </div>
      </div>
    </>
  )
}
