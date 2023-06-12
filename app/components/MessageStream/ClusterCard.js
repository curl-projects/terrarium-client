import { useEffect, useState, useRef } from 'react';
import cn from "classnames";
import MessageCard from "~/components/MessageStream/MessageCard";
import * as d3 from 'd3';

export default function ClusterCard(props) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const clusterCardRef = useRef();

  function handleClusterCardClick(){
    if(!isCardExpanded){
        props.setZoomObject({id: props.clusterData[0].cluster.internalClusterId, type: "cluster"})
    }
    else if(isCardExpanded && (Object.values(props.allCardsStatus).map(a => a.expanded)).filter((v)=> (v === true)).length === 1){
        props.setZoomObject(null)
    }

    setIsCardExpanded(!isCardExpanded)
  }

  function handleMouseOver(event, clusterId){
    console.log("CLUSTER MOUSED OVER:", clusterId)
    d3.select(`#cluster-${clusterId}`)
      .classed("mouseOverCluster", true)
      .transition()
      .duration(100)
      .ease(d3.easeCubicInOut)
      .attr('fill', 'rgb(176, 191, 185)')
    
    setIsHovered(true)
      

  }

  function handleMouseOut(event, clusterId){
    d3.select(`#cluster-${clusterId}`)
      .classed("mouseOverCluster", false)
      .transition()
      .duration(100)
      .ease(d3.easeCubicInOut)
      .attr('fill', "rgba(119, 153, 141, 0.7)")

    setIsHovered(false)
  }

  useEffect(()=>{
    if(props.expandSpecificCard && props.expandSpecificCard.cardType === 'cluster' && props.expandSpecificCard.cardId === props.clusterData[0].cluster.internalClusterId){
        clusterCardRef.current.scrollIntoView({block: "start", behaviour: "smooth"})
        setIsCardExpanded(true)
    }
    else if(props.expandSpecificCard && props.expandSpecificCard.cardType ==='cluster'){
        setIsCardExpanded(false)
    }
  }, [props.expandSpecificCard])

  useEffect(()=>{
    props.setAllCardsStatus(prevState => ({...prevState, [props.clusterIndex]: {expanded: isCardExpanded}}))
  }, [isCardExpanded])


  return (
    <div 
        className='clusterCard relative' 
        onMouseOver={event => handleMouseOver(event, props.clusterData[0].cluster.internalClusterId)}
        onMouseOut={event => handleMouseOut(event, props.clusterData[0].cluster.internalClusterId)}
        >
      <div
        ref={clusterCardRef}
        onClick={handleClusterCardClick}
        className={cn(
          'bg-white px-1 py-1 cursor-pointer tracking-tight  leading-5 text-sm text-gray-600 font-medium',
          {"text-gray-800": isHovered}
        )}
      >
        Cluster {props.clusterData[0].cluster.internalClusterId}
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
