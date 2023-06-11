// REACT-REMIX IMPORTS
import { useState, useEffect } from "react";
import { redirect } from "@remix-run/node"
import { useLoaderData, useActionData, Form, useFetcher, useNavigate } from "@remix-run/react";
import { ClientOnly } from "remix-utils";

// MODULE IMPORTS
import { authenticator } from "~/models/auth.server.js";
import { readFeature, updateFeatureTitle, updateFeatureIsSearched } from "~/models/kanban.server"
import { findFeatureRequests, associateFeatureRequestsWithFeature } from "~/models/feature-requests.server"
import { embeddingSearch } from "~/models/embedding-search.server"

// PACKAGE IMPORTS
import cn from 'classnames'
import Textarea from 'react-expanding-textarea';
import { CgSpinner } from "react-icons/cg"

// COMPONENTS
import RichTextEditor from "~/components/TextEditor/RichTextEditor.tsx"
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

export async function action({ request }){
  const formData = await request.formData();
  const featureId = formData.get('featureId');
  const searchTerm = formData.get('searchTerm');
  return redirect(`/feature/notepad/${featureId}?searchTerm=${searchTerm}`)
}


export default function FeatureNotepad(){
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const fetcher = useFetcher();
  const transition = useNavigate();

  return(
    <>
      <div className="notepadScaffold">
        <fetcher.Form className="textboxColumn" method='post'>
            <input type='hidden' name='featureId' value={loaderData.feature.id}/>
            <div className='searchBarWrapper'>
              <Textarea
                className='searchBar'
                placeholder={"Enter a Feature Description"}
                name="searchTerm"
                defaultValue={loaderData.feature.title}
              />
            </div>
              <button className="searchBarSubmit" type="submit">
                { transition.type === "fetchActionRedirect" ?
                  <><div style={{marginRight: "5px"}}>Finding Feature Requests </div><CgSpinner className="animate-spin" /></>
                  : loaderData.isSearched ? "Update Search Term" : "Find Feature Requests"
                }
              </button>
          <ClientOnly>
            {() => <RichTextEditor
                      featureId={loaderData.feature.id} />}
          </ClientOnly>
        </fetcher.Form>
        <div className="messageStreamColumn">
          <MessageStream
            data={loaderData.featureRequests}
            featureId={loaderData.feature.id} />
        </div>
      </div>
    </>
  )
}
