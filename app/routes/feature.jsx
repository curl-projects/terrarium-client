// REACT-REMIX IMPORTS
import { useState, useEffect } from "react";
import { redirect } from "@remix-run/node"
import { useLoaderData, useActionData, Form, useFetcher, useTransition } from "@remix-run/react";
import { ClientOnly } from "remix-utils";

// MODULE IMPORTS
import { authenticator } from "~/models/auth.server.js";
import { readFeature, updateFeatureTitle, updateFeatureIsSearched } from "~/models/kanban.server"
import { findFeatureRequests, associateFeatureRequestsWithFeature } from "~/models/feature-requests.server"
import { embeddingSearch } from "~/models/embedding-search.server"


import FeatureHeader from "~/components/Header/FeatureHeader";
import { ImSearch } from "react-icons/im"
import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import MessageStream from "~/components/MessageStream/MessageStream.js"

export async function loader({ request, params}){
    const user = await authenticator.isAuthenticated(request, {
      failureRedirect: "/",
    })
    const url = new URL(request.url)
    const searchTerm = url.searchParams.get("searchTerm")
  
  
    const featureId = params["*"]
    const feature = await readFeature(featureId)
  
    // make sure the right user is looking at the feature information
    if(feature.userId !== user.id){
      return redirect("/")
    }
  
    if(searchTerm){
      // update feature title
      const updatedFeature = await updateFeatureTitle(featureId, searchTerm)
  
      // conduct search
      const knnIDs = await embeddingSearch(searchTerm); // get sorted scores
  
      // update all feature requests for easier future recall
      const updatedFeatures = await associateFeatureRequestsWithFeature(knnIDs, featureId)
  
      // mark search as completed
      const markedFeature = await updateFeatureIsSearched(featureId)
  
      // // works because of the update above
      // const featureRequests = await findFeatureRequests(featureId)
      console.log("REDIRECT", featureId)
      console.log("REDIRECT URL", `/feature/nodepad/${featureId}`)
      return redirect(`/feature/notepad/${featureId}`)
    }
  
    if(feature.isSearched){
      const featureRequests = await findFeatureRequests(featureId); // get associated data objects
      return { feature: feature, featureRequests: featureRequests }
    }
  
    return { feature: feature, featureRequests: [] }
  }
  

export default function Feature(){
    const params = useParams();
    const matches = useMatches();

    const loaderData = useLoaderData();
    const actionData = useActionData();
    const fetcher = useFetcher();
    const transition = useTransition();

    return(
        <>
        <FeatureHeader />
            <div className="featureScaffold">
                <div className="featureTitleWrapper">
                    <div className='featureTitleInnerWrapper'>
                        <h1 className='featureTitleText'>Responsive Whiteboards </h1>
                    </div>
                    <div className='featurePositionWrapper'> 
                        <h1 className='featurePositionText'> / <span style={{color: "#B0BFB9"}}>Discovery</span></h1>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='searchIconWrapper'>
                        <ImSearch className='searchIconText'/>
                    </div>
                </div>
                <div className="pinnedMessagesWrapper">
                    <p className='pinnedMessagesText'><em>5 pinned messages</em></p>
                </div>
                <div className='featureDescriptionWrapper'>
                    <p className='featureDescriptionText'>This feature centres around improving the whiteboard functionality of Heptabase, especially interactivity, multiple whiteboards and responsiveness.</p>
                </div>
            <div className='workspaceScaffold'>
                <div className='workspaceOutletScaffold'>
                    <div className='workspaceOutletControls'>
                        <Link to={`/feature/discovery/${params["*"]}`}>
                            <div className={cn('notepadTab discovery',
                                                {"notepadTabActive": matches[2] ? matches[2].pathname.includes('discovery') : false}
                                                )}>
                                <p className="notepadTabLabel">Discovery</p>
                            </div>
                        </Link>
                        <Link to={`/feature/notepad/${params["*"]}`}>
                            <div className={cn('notepadTab writing',
                                                {"notepadTabActive": matches[2] ? matches[2].pathname.includes('notepad') : false}
                                                )}>
                                <p className="notepadTabLabel">Notepad</p>
                            </div>
                        </Link>
                    </div>
                    <div className='workspaceOutletInnerScaffold'>
                        <Outlet />
                    </div>
                </div>
                <div className='messageStreamScaffold'>
                    <div className="messageStreamColumn">
                        <MessageStream
                            data={loaderData.featureRequests}
                            featureId={loaderData.feature.id} />
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}