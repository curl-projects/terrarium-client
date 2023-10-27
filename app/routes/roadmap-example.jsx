import { useEffect, useState } from "react";
import { useLoaderData, useActionData, Outlet, Link, useParams, useMatches } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import Header from "~/components/Header/Header";
import Roadmap from "~/components/Roadmap/Roadmap"

import { authenticator } from "~/models/auth.server.js";

import { getFeatures, createFeature, deleteFeature, updateAllFeaturePositions } from "~/models/kanban.server"
import { processCardState } from "~/utils/processCardState"
import cn from "classnames";

import PageTitle from "~/components/Header/PageTitle.js"
import FeatureSearch from "~/components/Feature/FeatureSearch";
import { getRoadmapDatasets } from "~/models/dataset-manipulation.server";
import { Fade } from "react-awesome-reveal";

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const features = await getFeatures(user.id)
  const datasets = await getRoadmapDatasets(user.id)
  console.log("DDs:", datasets)

  const organisedFeatures = processCardState(features)
  return({ features: organisedFeatures, datasets: datasets.map(e => e['dataset']) })
}

export async function action({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  console.log("HELLO!", actionType)

    if(actionType === 'search'){
        const columnState = "1"
        const computedRankState = formData.get("computedRankState")
        const searchTerm = formData.get("searchTerm")
        const selectedDatasets = formData.get("selectedDatasets")

        console.log("IMPORTANT:", computedRankState, searchTerm)
        console.log("IMPORTANT 2:", selectedDatasets)
        const feature = await createFeature(user.id, columnState, computedRankState)
    return redirect(`/feature/discovery/${feature.id}?searchTerm=${searchTerm}&selectedDatasets=${selectedDatasets}`)
  }
}

export default function RoadmapExample(){
    const loaderData = useLoaderData();
    const actionData = useActionData();
    const matches = useMatches();
    const [colStateWatcher, setColStateWatcher] = useState([])

    useEffect(()=>{
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])

    useEffect(()=>{
      console.log("COL STATE WATCHER:", colStateWatcher)
  }, [colStateWatcher])

  useEffect(()=>{
    loaderData?.features[0] && setColStateWatcher(loaderData.features[0])
  }, [loaderData])

    return(
        <div className='roadmapPageWrapper'>
            <Header />
            <FeatureSearch 
                datasets={loaderData.datasets}
                colStateWatcher={colStateWatcher}
                />
        </div>
    )
}