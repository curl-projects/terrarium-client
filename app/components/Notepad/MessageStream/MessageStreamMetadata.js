import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function MessageStreamMetadata({isExpanded, setIsExpanded, scrollToTop, ...props }) {

  
  return (
    <div className='flex w-full justify-between items-center sticky top-0 px-4 py-2 z-10 bg-gray-100/90 backdrop-blur-sm text-xs'>
      <p
        className="text-gray-800 font-bold"
      >
        {numberWithCommas(props.data.length)} <span className="text-gray-400 font-medium"> Feature Requests</span>
      </p>

      <div className='flex gap-1'>

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
