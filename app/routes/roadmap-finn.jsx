import { useEffect, useState } from "react";
import { useLoaderData, useActionData, Outlet, Link, useParams, useMatches } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import Header from "~/components/Header/Header";
import Roadmap from "~/components/Roadmap/Roadmap"

import { authenticator } from "~/models/auth.server.js";

import { getFeatures, createFeature, deleteFeature, updateAllFeaturePositions } from "~/models/kanban.server"
import { processCardState } from "~/utils/processCardState"
import cn from "classnames";

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const features = await getFeatures(user.id)
  console.log("FEATURES!:", features)

  const organisedFeatures = processCardState(features)
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
    const matches = useMatches();

    return(
        <>
            <Header />
            <div className='kanbanRoadmapWrapper'>
                    <div className='kanbanRoadmapTitle'>
                        <h1 className='kanbanRoadmapTitleText'>Roadmap</h1>
                    </div>
                    <div className='kanbanRoadmapDescription'>
                        <p className='kanbanRoadmapDescriptionText'>Use this space to create and organise features.</p>
                    </div>
                    <div className='kanbanRoadmapColumns'>
                        <Roadmap features={loaderData.features} />
                    </div>
            </div>
        </>
    )
}