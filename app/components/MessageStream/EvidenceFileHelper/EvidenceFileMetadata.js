import { useParams } from "@remix-run/react"

import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';
import CircularProgress from '@mui/material/CircularProgress';
import { ImCross } from "react-icons/im";
import { BsX } from "react-icons/bs";
import { useEffect } from "react";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function EvidenceFileMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {
const params = useParams()

useEffect(()=>{
    props.setDataView('ai')
}, [])

  return (
    <div className='messageStreamMetadataWrapper' id='tourMessageStreamMetadata'>
    <div className='messageStreamMetadataSection'
            onClick={()=>props.setDataView('ai')}
            style={{
            borderBottom: props.dataView === 'ai' ? '2px solid gainsboro' : "none",
            paddingBottom: props.dataView === 'ai' ? '6px'  : "0px",
            top: props.dataView === 'ai' ? '5px'  : "0px",
            }}
        >
        <p className='messageStreamMetadataText'>
            <span className="messageStreamMetadataIcon"></span>
            Terrarium AI
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('featureRequests')}
           style={{
            borderBottom: props.dataView === 'featureRequests' ? '2px solid gainsboro' : "none",
            paddingBottom: props.dataView === 'featureRequests' ? '6px'  : "0px",
            top: props.dataView === 'featureRequests' ? '5px'  : "0px",
           }}
           >
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{numberWithCommas(props.data.length)}</span>
          {props.data.length == 1 ? "Feature Request" : "Feature Requests"}
          {props.filters.length > props.invisibleFilters.length && " (Filtered)"}
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
