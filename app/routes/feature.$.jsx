// LIBRARIES
// import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData } from "@remix-run/react"
import { json } from '@remix-run/node';
import cn from 'classnames'

// MODELS
// import { embeddingSearch } from "~/models/search-embeddings.server"

// UTILITIES
import { filterSearchedData } from "~/utils/filterSearchedData.js"
import { manipulateInputData } from "~/utils/manipulateInputData.js"

// COMPONENTS
import SearchTextEditor from "~/components/Notepad/SearchTextEditor/SearchTextEditor.js"
// import D3CanvasScaffold from "~/components/Canvas/D3CanvasScaffold.js"
import MessageStream from "~/components/Notepad/MessageStream/MessageStream.js"
import TextBoxSearchBar from "~/components/Notepad/TextBoxSearchBar/TextBoxSearchBar.js"

// DATA
import d from "~/mock-data/final_output.json"

// STYLES
import experimentThreeStylesheetUrl from "~/styles/experimentThree.css"
import draftjsStylesheetUrl from "draft-js/dist/Draft.css"

const data = manipulateInputData(d)

export const links = () => {
  return [
    { rel: "stylesheet", href: experimentThreeStylesheetUrl },
    { rel: "stylesheet", href: draftjsStylesheetUrl },
  ]
}

export async function loader({ request, params }){
  const featureId = params["*"].split("-").at(-1)

  console.log("PARAMS!", featureId)
  return null
}


export async function action({ request }){
  const formData = await request.formData()
  const filterType = formData.get('filterType')
  if(filterType && filterType === 'search'){
    const knnIDs = await embeddingSearch(formData)
    const data = {
      knnIDs: knnIDs,
      filterType: filterType
    }
    return json(data)
  }
}

export default function FeatureNotepad() {

  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)
  const [isSubmitted, setSubmitted] = useState(false);
  const [isFocused, setFocus] = useState(false);

  useEffect(() => {
    console.log("ACTION DATA", actionData)
    if (actionData?.filterType === 'search') {
      if (actionData.knnIDs) {
        filterSearchedData(data, actionData.knnIDs, setTopLevelStreamDataObj, setSearchResults)
      }
    }
  }, [actionData])


  function resetSearchData() {
    setTopLevelStreamDataObj(data)
    setSearchResults([])
  }

  return (
    <div className="relative  md:p-24 lg:px-32 lg:py-22 xl:px-56 xl:py-24 2xl:px-96 2xl:py-32 h-screen w-screen">
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
          />
          <SearchTextEditor isSubmitted={isSubmitted} />
        </div>
        <div className='bg-gray-100 overflow-y overflow-x-hidden xl:w-2/5 md:w-3/5 sm:w-3/5'>
          <MessageStream
            data={topLevelStreamDataObj}
          />
        </div>
      </div>
    </div>
  );
}
