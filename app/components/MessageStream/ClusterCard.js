import { useEffect, useState, useRef } from 'react';
import { useFetcher } from "@remix-run/react";
import cn from "classnames";
import MessageCard from "~/components/MessageStream/MessageCard";
import * as d3 from 'd3';
import { AiOutlineSave } from "react-icons/ai"
import TextareaAutosize from 'react-textarea-autosize';
import { ToWords } from 'to-words';
import TopicTag from "~/components/MessageStream/TopicTag";
import { MdNotes } from 'react-icons/md';

export default function ClusterCard(props) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [descriptionText, setDescriptionText] = useState("")
  const [descriptionFocused, setDescriptionFocused] = useState(false)
  const clusterCardRef = useRef();
  const clusterDescriptionFetcher = useFetcher();
  const toWords = new ToWords()


  function handleClusterCardClick(){
    console.log("PROPS.CLUSTER DATA", props.clusterData[0])
    if(!isCardExpanded){
        props.setZoomObject({id: props.clusterData[0].cluster.internalClusterId, type: "cluster"})
    }
    else if(isCardExpanded && (Object.values(props.allCardsStatus).map(a => a.expanded)).filter((v)=> (v === true)).length === 1){
        props.setZoomObject(null)
    }

    setIsCardExpanded(!isCardExpanded)
  }

  function handleMouseOver(event, clusterId){
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
        <div onClick={handleClusterCardClick} style={{cursor: 'pointer'}} className='clusterCardOuter'>
        <div ref={clusterCardRef} className='clusterCardInner' >
            <p className='clusterCardTitle'>Cluster {toWords.convert(props.clusterData[0].cluster.internalClusterId+1)}</p>
            <div style={{flex: 1}}/>
            <div className='clusterCardTitleMetadataWrapper'>
                <p className='clusterCardTitleMetadata'>5 Feature Requests</p>
            </div>
        </div>

        <div className='clusterCardTitleSeparator'/>

        <div className='clusterCardTagsWrapper'>
            {props.clusterData[0].cluster.clusterTags.map((clusterTag, idx) => (
                <TopicTag 
                    key={idx}
                    idx={idx}
                    clusterTag={clusterTag}
                    />
            ))
            }
        </div>
        {descriptionText && !(isCardExpanded || props.isExpanded) && 
            <div className='clusterCardExternalNotesWrapper'>
                <p className='clusterCardExternalNotes'>{descriptionText}</p>
            </div>
        }
      </div>

      {(isCardExpanded || props.isExpanded) && (
        <div
          className={cn(
            "flex flex-col gap-2 px-3 py-2 text-sm tracking-tight text-gray-600/90 font-normal",
          )}>
        <clusterDescriptionFetcher.Form method='get' action="/utils/set-cluster-description" className='clusterDescriptionWrapper'>
            <div className='clusterDescriptionContentWrapper'>
                <div className='clusterDescriptionIcon'>
                    <MdNotes style={{color: 'rgba(31, 41, 55, 0.6)', fontSize: "24px"}}/>
                </div>
                <div className='clusterDescriptionInnerWrapper'>
                <TextareaAutosize 
                    style={{width: '100%', fontSize: "14px"}}
                    value={(descriptionText == "" && !descriptionFocused) ? "No Notes" : descriptionText}
                    onChange={(e)=>setDescriptionText(e.target.value)}
                    onFocus={()=>setDescriptionFocused(true)}
                />
                </div>
            </div>
            <input type='hidden' name='clusterId' value={props.clusterData[0].cluster.clusterId}/>
            <input type='hidden' name='description' value={descriptionText}/>
            <div className='clusterDescriptionSubmitWrapper'>
                <button type="submit" style={{fontSize: descriptionFocused ? "16px" : "0px"}}>
                    <p onClick={()=>setDescriptionFocused(false)} 
                       className='clusterDescriptionSaveWrapper'
                       style={{fontWeight: 'bold', fontSize: descriptionFocused ? "12px" : "0px", color: "#B0BFB9"}}>
                        Save
                    </p>
                </button>
                <div style={{flex: 1}}/>
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
