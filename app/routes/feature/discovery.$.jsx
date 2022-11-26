// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
// REACT & REMIX
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useOutletContext, useFetcher } from "@remix-run/react";
import { json } from '@remix-run/node';

// MODELS
import { readFeature } from "~/models/kanban.server";
import { findFeatureRequests } from "~/models/feature-requests.server";
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

export async function loader({ request, params }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const featureId = params['*']
  const feature = await readFeature(featureId)
  const featureRequests = await findFeatureRequests(featureId); // get associated data objects

  return { featureRequests: featureRequests, feature: feature}
}

export async function action({ request }){
  const formData = await request.formData()
  const filterType = formData.get('filterType')
  if(filterType && filterType === 'search'){
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

  useEffect(()=>{
    console.log('LOADER DATA', loaderData)
  }, [loaderData])

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



  return (
    <>
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
    </>
  );
}
