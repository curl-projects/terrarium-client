import { useEffect, useState } from 'react';
import cn from "classnames";
import MessageCard from "~/components/MessageStream/MessageCard";


export default function ClusterCard(props) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  function handleClusterCardClick(){
    if(!isCardExpanded){
        props.setZoomObject({id: props.clusterData[0].cluster, type: "cluster"})
    }
    setIsCardExpanded(!isCardExpanded)

  }


  return (
    <div 
        className='clusterCard relative' 
        // onMouseOver={()=>props.setZoomObject({id: props.clusterIndex, type: "cluster"})}
        // onMouseOut={()=>props.setZoomObject(null)}
        >
      <div
        onClick={handleClusterCardClick}
        className={cn(
          'bg-white px-1 py-1 cursor-pointer tracking-tight  leading-5 text-sm text-gray-600 font-medium',
          {"text-gray-800": isHovered}
        )}
      >
        Cluster {props.clusterData[0].cluster}
      </div>

      {(isCardExpanded || props.isExpanded) && (
        <div
          className={cn(
            "flex flex-col gap-2 px-3 py-2 text-sm tracking-tight text-gray-600/90 font-normal",
          )}>
          <p className='mt-2'>Topic: Multiple whiteboards</p>
          <div className="pl-10 pr-8 flex flex-col gap-2" style={{backgroundColor: "rgb(243, 244, 246)"}}>
            {props.clusterData.map((cardData, idx) => (
                <MessageCard
                idx={idx}
                key={cardData.featureRequest.fr_id}
                cardData={cardData.featureRequest}
                isExpanded={props.isExpanded}
                pinCard={props.pinCard} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
