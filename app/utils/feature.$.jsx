// LIBRARIES

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData } from "@remix-run/react"
import { json, redirect } from '@remix-run/node';
import cn from 'classnames'

// MODELS
import { embeddingSearch } from "~/models/embedding-search.server"
import { readFeature, updateFeatureTitle } from "~/models/kanban.server"
import { readFeatureRequests } from "~/models/feature-requests.server"
import { authenticator } from "~/models/auth.server.js";

// UTILITIES
import { filterSearchedData } from "~/models/feature-requests.server.js"
import { manipulateInputData } from "~/utils/manipulateInputData.js"

// COMPONENTS
import SearchTextEditor from "~/components/Notepad/SearchTextEditor/SearchTextEditor.js"
import MessageStream from "~/components/Notepad/MessageStream/MessageStream.js"
import TextBoxSearchBar from "~/components/Notepad/TextBoxSearchBar/TextBoxSearchBar.js"
import RichTextEditor from "~/components/LeoEditor/RichTextEditor.tsx"
import FeatureHeader from "~/components/Header/FeatureHeader"

// STYLES

export async function loader({ request, params }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  console.log("FEATURE ID PARAMS", params)
  const featureId = params["*"].split("-").at(-1)

  console.log("FEATURE ID:", featureId)
  const feature = await readFeature(featureId)
  console.log("FEATURE!", feature)

  if(feature.isSearched){
    console.log("IS SEARCHED!")
  }

  const featureRequests = await readFeatureRequests(user.id)
  const processedFeatureRequests = manipulateInputData(featureRequests)
  return { feature: feature, data: processedFeatureRequests}
}


export async function action({ request, params }){
  const formData = await request.formData()
  const featureId = formData.get('featureId')
  const searchString = formData.get('featureDescription')
  const filterType = formData.get('filterType')
  const updatedFeature = await updateFeatureTitle(featureId, searchString)

  console.log("ACTION HI!")
  if(filterType && filterType === 'search'){
    const fullfrData = formData.get('data')
    const jsonData = JSON.parse(fullfrData)

    const knnIDs = await embeddingSearch(searchString)

    // UPDATE DATABASE WITH KNN IDS INFO
    const filteredData = await filterSearchedData(jsonData, knnIDs)

    console.log("FILTERED DATA", filteredData)

    const data = {
      filterType: filterType,
      filteredData: filteredData,
      knnIDs: knnIDs
    }

    return json(data)
  }
}

export default function FeatureNotepad() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(loaderData.data)
  const [isSubmitted, setSubmitted] = useState(false);
  const [isFocused, setFocus] = useState(false);

  useEffect(() => {
    console.log("HI")
    if (actionData?.filterType === 'search') {
      if (actionData.knnIDs) {
        setTopLevelStreamDataObj(actionData.filteredData)
        setSearchResults(actionData.knnIDs)
      }
    }
  }, [actionData])

  useEffect(() => {
    console.log("ACTION DATA", actionData)
  }, [actionData])

  useEffect(()=>{
    console.log('LOADER DATA', loaderData)
  }, [loaderData])

  function resetSearchData() {
    setTopLevelStreamDataObj(loaderData.data)
    setSearchResults([])
  }

  return (
    <>
    <FeatureHeader />
    <div className="relative md:p-24 lg:px-32 lg:py-22 xl:px-56 xl:py-24 2xl:px-96 2xl:py-32 h-screen w-screen"
      style={{margin: "60px"}}>
      <div className="h-full w-full bg-gray-100 border flex">
        <div
          className={cn(
            "bg-white bg-clip-border  grow flex flex-col relative transition-all duration-500 ease-in-out",
            { 'textbox-shadow z-20 translate-x-2 -translate-y-2 border border-gray-200': isFocused }
          )}
        >
          <TextBoxSearchBar
            resetSearchData={resetSearchData}
            isSubmitted={isSubmitted}
            setSubmitted={setSubmitted}
            setFocus={setFocus}
            feature={loaderData.feature}
            data={loaderData.data}
          />
        <RichTextEditor
          featureId={loaderData.feature.id}
          />
        </div>
        <div className='bg-gray-100 overflow-y overflow-x-hidden xl:w-2/5 md:w-3/5 sm:w-3/5'>
          <MessageStream
            data={topLevelStreamDataObj}
          />
        </div>
      </div>
    </div>
    </>
  );
}


// <SearchTextEditor isSubmitted={isSubmitted} />
