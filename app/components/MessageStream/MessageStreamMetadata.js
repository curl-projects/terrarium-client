import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function MessageStreamMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {

  
  return (
    <div className='messageStreamMetadataWrapper'>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('featureRequests')}>
        <p>
          <span className="messageStreamMetadataIcon">{numberWithCommas(props.data.length)}</span>
          Feature Requests
        </p>
      </div>
      <div className='messageStreamMetadataSection'
           onClick={()=>props.setDataView('clusters')}>
      <p>
          <span className='messageStreamMetadataIcon'>20</span>
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
