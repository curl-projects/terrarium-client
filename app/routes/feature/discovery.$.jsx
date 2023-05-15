// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import Textarea from 'react-expanding-textarea';
import { CgSpinner } from "react-icons/cg"
import { GoSearch } from "react-icons/go"

dayjs.extend(utc)

// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useOutletContext, useFetcher, useTransition } from "@remix-run/react";
import { json, redirect } from '@remix-run/node';


// MODELS
import { readFeature, updateFeatureTitle, updateFeatureIsSearched } from "~/models/kanban.server";
import { findFeatureRequests, associateFeatureRequestsWithFeature } from "~/models/feature-requests.server";
import { authenticator } from "~/models/auth.server.js";
import { embeddingSearch } from "~/models/embedding-search.server";


// UTILITIES
import { filterSearchedData } from "~/utils/filterSearchedData"

// COMPONENTS
import FeatureHeader from "~/components/Header/FeatureHeader";
import PointFieldSearch from "~/components/PointField/PointFieldSearch";
import PointFieldScaffold from "~/components/PointField/PointFieldScaffold.js";
import MessageStream from "~/components/MessageStream/MessageStream.js";

// DATA

// STYLES

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
    return redirect(`/feature/discovery/${featureId}`)
  }

  if(feature.isSearched){
    const featureRequests = await findFeatureRequests(featureId); // get associated data objects
    return { feature: feature, featureRequests: featureRequests }
  }

  return { feature: feature, featureRequests: [] }
}

export async function action({ request }){
  const formData = await request.formData()
  const featureId = formData.get("featureId")
  const searchTerm = formData.get('searchTerm')
  const filterType = formData.get('filterType')

  if(searchTerm && featureId){
    return redirect(`/feature/discovery/${featureId}?searchTerm=${searchTerm}`)
  }
  else if(filterType && filterType === 'search'){
    const searchString = formData.get('searchString');
    const knnIDs = await embeddingSearch(searchString)
    const data = {
      knnIDs: knnIDs,
      filterType: filterType
    }
    return json(data)
  }
}

export default function Discovery() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])
  const [zoomObject, setZoomObject] = useState(null)
  const [dateValue, setDateValue] = useState(null);
  const searchFetcher = useFetcher();
  const fetcher = useFetcher();
  const transition = useTransition();

  useEffect(()=>{
    const dateFilteredArray = []
    if(topLevelStreamDataObj[0]){
      for(let fr of loaderData.featureRequests){
        // console.log(fr.featureRequest.created_at, dayjs.utc(fr.featureRequest.created_at).isAfter(dayjs.utc(dateValue)))
        if(dayjs.utc(fr.featureRequest.created_at).isAfter(dayjs.utc(dateValue))){
          dateFilteredArray.push(fr)
        }
      }
    }
    setTopLevelStreamDataObj(dateFilteredArray)
    setSearchResults(dateFilteredArray.map(a => a.featureRequestId))
    console.log('DATE FILTERED ARRAY', dateFilteredArray)
  }, [dateValue])


  useEffect(()=>{
    if(searchFetcher.data && searchFetcher.data.featureRequests){
      const featureRequests = searchFetcher.data.featureRequests;
      setTopLevelStreamDataObj(featureRequests);
      setSearchResults(featureRequests.map(a => a.featureRequestId));
    }
  }, [searchFetcher.data])

  function resetSearchData(){
    setTopLevelStreamDataObj(loaderData.featureRequests)
    setSearchResults([])
  }

  useEffect(()=>{
    setTopLevelCanvasDataObj(loaderData.featureRequests.map(a => a.featureRequest))
    setTopLevelStreamDataObj(loaderData.featureRequests)

      }, [loaderData])


  useEffect(()=>{
    if(zoomObject){
      filterZoomedData(zoomObject)
    }
  }, [zoomObject])

  function filterZoomedData(zoomObject){
    let zoomObjectMap = {
      'cluster': "kmeans_labels",
      'regionCluster': 'regionCluster'
    }

    const clusterIdName =  zoomObjectMap[zoomObject.type]

    const filteredData = loaderData.data.filter(obj => obj[clusterIdName] === zoomObject.id)
  }
  function resetZoomedData(e, changeParam){
    setZoomObject(null)
  }

  function filterBrushedData(brushedData){
    let dataIds = brushedData.map(a => a.fr_id)

    const filteredData = loaderData.featureRequests.filter(({ featureRequestId}) => dataIds.includes(featureRequestId))
    console.log(filteredData)

    setTopLevelStreamDataObj(filteredData)
  }
  function resetBrushFilter(){
    setTopLevelStreamDataObj(loaderData.featureRequests)
  }

  useEffect(()=>{
    console.log("Transition Type:", transition.type)
  })

  return (
    <>
      <div className="discoveryOverarchingWrapper">
        <div className="discoveryTopicSearchWrapper">
          <fetcher.Form className="discoveryTextboxColumn" method='post'>
              <input type='hidden' name='featureId' value={loaderData.feature.id}/>
              <div className='discoveryTopicSearchBarWrapper'>
                <input
                  className='discoveryTopicSearchBar'
                  placeholder={"Enter a Feature Description"}
                  name="searchTerm"
                  defaultValue={loaderData.feature.title}
                />
              </div>
                <button className="discoveryTopicSearchBarSubmit" type="submit">
                  { transition.type === "fetchActionRedirect" ?
                    <><CgSpinner className="animate-spin" /></>
                    : <><h1 style={{fontSize: '26px'}}><GoSearch/></h1></>
                  }
                </button>
          </fetcher.Form>
        </div>
        <div className='featureDiscoveryWrapper'>
          <div className="discoveryMessageStreamColumn">
            <MessageStream
              data={topLevelStreamDataObj}
              featureId={loaderData.feature.id}
              zoomObject={zoomObject}
              setZoomObject={setZoomObject}
              />
          </div>
          <div className='discoveryPointComponentsWrapper'>
            <div className='discoverySearchWrapper'>
              <PointFieldSearch
                searchFetcher={searchFetcher}
                featureId={loaderData.feature.id}
                resetSearchData={resetSearchData}
                />
            </div>
            <div className='discoveryPointFieldWrapper'>
              <PointFieldScaffold
                data={topLevelCanvasDataObj}
                searchResults={searchResults}
                filterBrushedData={filterBrushedData}
                resetBrushFilter={resetBrushFilter}
                zoomObject={zoomObject}
                setZoomObject={setZoomObject}
                resetZoomedData={resetZoomedData}
                dateValue={dateValue}
                setDateValue={setDateValue}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
