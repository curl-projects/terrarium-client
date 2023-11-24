import { useParams } from "@remix-run/react"

import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';
import CircularProgress from '@mui/material/CircularProgress';
import { ImCross } from "react-icons/im";
import { BsX } from "react-icons/bs";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function MessageStreamMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {
const params = useParams()

function handleClusterClick(e){
  props.setDataView('clusters')
  props.setTriggerClusters(true)
  // if(props.clustersGenerated === "incomplete"){
  //   props.setClustersGenerated('initiated')
  //   props.clusterFetcher.submit({featureId: params["*"], searchString: props.featureTitle}, 
  //                               {method: "get", action: "/utils/regenerate-clusters"})
  // }
}

function handleRankedClick(){
  props.setDataView('semanticDimensions')
  props.setTriggerRanked(true)
}

  return (
    <div className='messageStreamMetadataWrapper' id='tourMessageStreamMetadata'>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('featureRequests')}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{numberWithCommas(props.data.length)}</span>
          {props.data.length == 1 ? "Feature Request" : "Feature Requests"}
          {props.filters.length > props.invisibleFilters.length && " (Filtered)"}
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={handleRankedClick}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">4</span>
          Semantic Dimensions
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={handleClusterClick}>
      <p className='messageStreamMetadataText'>
          <span className='messageStreamMetadataIcon'>
            <span>{props.clusterData.length}</span>
            {/* {
              {
                'incomplete': <span>0</span>,
                'initiated': <CircularProgress 
                                size="9px"
                                thickness={8}
                                sx={{
                                  color: 'rgb(31, 41, 55)'
                                }}/>,
                'completed': <span>{props.clusterData.length}</span>,
                'error': <BsX style={{fontSize: "18px", color: 'rgb(31, 41, 55)',
                                      position: "relative", left: "2px", bottom: "1px"}}/>
              }[props.clustersGenerated]
            } */}
          </span>
          {props.clusterData.length === 1 ? "Cluster" : "Clusters"}
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('authors')}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{props.authorData.length}</span>
          {props.authorData.length === 1 ? "Author" : "Authors"}
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('filters')}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{props.filters.length}</span>
          {props.filters.length === 1 ? "Filter" : "Filters"}
        </p>
      </div>
  
          

      <div style={{flex: 1}}/>

      <div style={{display: 'flex'}}>

        <AiOutlineArrowUp 
        size = {20}
        className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full  p-1 text-gray-500"
        onClick = {() => scrollToTop()}
        />

        <div onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ?
            <IoContract size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full  p-1 text-gray-500" /> :
            <IoExpand size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full p-1 text-gray-500" />}
        </div>
      </div>
    </div>
  )
}
