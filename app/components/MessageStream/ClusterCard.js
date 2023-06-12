import { useEffect, useState, useRef } from 'react';
import { useFetcher } from "@remix-run/react";
import cn from "classnames";
import MessageCard from "~/components/MessageStream/MessageCard";
import * as d3 from 'd3';
import { AiOutlineSave } from "react-icons/ai"

export default function ClusterCard(props) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [descriptionText, setDescriptionText] = useState("")
  const [descriptionFocused, setDescriptionFocused] = useState(false)
  const clusterCardRef = useRef();
  const clusterDescriptionFetcher = useFetcher();

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
    console.log("CLUSTER CARD DATA:", props.clusterData)
  }, [props.clusterData])

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

  useEffect(()=>{
    props.clusterData[0] && setDescriptionText(props.clusterData[0].cluster.description)
  }, [props.clusterData])

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
        <clusterDescriptionFetcher.Form method='get' action="/utils/set-cluster-description" className='clusterDescriptionWrapper'>
            <textarea 
                className='mt-2'
                value={descriptionText || "No topics identified"}
                onChange={(e)=>setDescriptionText(e.target.value)}
                onFocus={()=>setDescriptionFocused(true)}
            />
            <input type='hidden' name='clusterId' value={props.clusterData[0].cluster.clusterId}/>
            <input type='hidden' name='description' value={description}/>
            <div className='clusterDescriptionSubmitWrapper'>
                <button type="submit" style={{fontSize: descriptionFocused ? "16px" : "0px"}}>
                    <p onClick={()=>setDescriptionFocused(false)} 
                       className='clusterDescriptionSaveWrapper'
                       style={{fontWeight: 'bold', fontSize: descriptionFocused ? "12px" : "0px", color: "#B0BFB9"}}>
                        Save
                    </p>
                </button>
                <div style={{flex: 1 }}/>
            </div>
          </clusterDescriptionFetcher.Form>
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
