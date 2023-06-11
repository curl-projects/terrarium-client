import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';
import CircularProgress from '@mui/material/CircularProgress';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function MessageStreamMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {

  
  return (
    <div className='messageStreamMetadataWrapper'>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('featureRequests')}>
        <p className='messageStreamMetadataText'>
          <span className="messageStreamMetadataIcon">{numberWithCommas(props.data.length)}</span>
          Feature Requests
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('clusters')}>
      <p className='messageStreamMetadataText'>
          <span className='messageStreamMetadataIcon'>
            {
              {
                'incomplete': <span>0</span>,
                'initiated': <CircularProgress size="10.5px"/>,
                'completed': <CircularProgress 
                                size="9px"
                                thickness={8}
                                sx={{
                                  color: 'rgb(31, 41, 55)'
                                }}/>
                // 'completed': <span>20</span>
              }[props.clustersGenerated]
            }
          </span>
          Clusters
        </p>
        {/* {
          {
            "incomplete": <p>Clusters Incomplete</p>,
            'initiated': <p>Clusters Generating</p>,
            'completed': <p>Clusters Completed</p>
          }[props.clustersGenerated]
        } */}
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
