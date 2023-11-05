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

  const organisedFeatures = processCardState(features)
  return({ features: organisedFeatures, datasets: datasets.map(e => e['dataset']) })
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

    console.log("COLUMN STATE:", columnState)
    console.log("RANK STATE:", rankState)
    const feature = await createFeature(user.id, columnState, rankState)
    return redirect(`/feature/discovery/${feature.id}`)
  }
  else if(actionType === "delete"){
    const featureId = formData.get('featureId');
    const deletedFeature = await deleteFeature(featureId);
    return ({ deleteFeature })
  }
  else if(actionType === 'search'){
    const columnState = "1"
    const computedRankState = formData.get("computedRankState")
    const searchTerm = formData.get("searchTerm")
    const selectedDatasets = formData.get("selectedDatasets")

    const feature = await createFeature(user.id, columnState, computedRankState)
    return redirect(`/feature/discovery/${feature.id}?searchTerm=${searchTerm}&selectedDatasets=${selectedDatasets}`)
  }
}

export default function RoadmapRoute(){
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

    return(
        <div className='roadmapPageWrapper'>
            <Header />
            <PageTitle title="Archive" padding={false} centered={true} description="View and organise all of the questions that you've asked."/>
            <Fade className='kanbanRoadmapWrapper' duration={2000} delay={0}>
                  <div className='kanbanRoadmapColumns'>
                      <Roadmap 
                        features={loaderData.features} 
                        setColStateWatcher={setColStateWatcher}
                        />
                  </div>
            </Fade>
        </div>
    )
}