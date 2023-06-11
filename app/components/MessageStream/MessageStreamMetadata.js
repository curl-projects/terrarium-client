import { useParams } from "@remix-run/react"

import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';
import CircularProgress from '@mui/material/CircularProgress';
import { ImCross } from "react-icons/im";


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function MessageStreamMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {
const params = useParams()

function handleClusterClick(e){
  props.setDataView('clusters')
  props.setTriggerClusters(true)
  if(props.clustersGenerated === "incomplete"){
    props.setClustersGenerated('initiated')
    props.clusterFetcher.submit({featureId: params["*"], searchString: props.featureTitle}, 
                                {method: "get", action: "/utils/regenerate-clusters"})
  }
}

  return (
    <div className='messageStreamMetadataWrapper'>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('featureRequests')}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{numberWithCommas(props.data.length)}</span>
          {props.data.length == 1 ? "Feature Request" : "Feature Requests"}
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={handleClusterClick}>
      <p className='messageStreamMetadataText'>
          <span className='messageStreamMetadataIcon'>
            {
              {
                'incomplete': <span>0</span>,
                'initiated': <CircularProgress 
                                size="9px"
                                thickness={8}
                                sx={{
                                  color: 'rgb(31, 41, 55)'
                                }}/>,
                'completed': <span>{props.clusterData.length}</span>
              }[props.clustersGenerated]
            }
          </span>
          {props.clusterData.length == 1 ? "Cluster" : "Clusters"}
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
