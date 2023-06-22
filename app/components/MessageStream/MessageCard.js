import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cn from "classnames";
import { BsChatLeftText } from "react-icons/bs";
import { AiOutlinePushpin } from "react-icons/ai";
import { BiMessageSquareDetail } from 'react-icons/bi'

export default function MessageCard({ isExpanded, isPinned, pinCard, ...props}) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [messageDate, setMessageDate] = useState("")
  const messageCardRef = useRef();

  useEffect(()=>{
    if(props.cardData?.created_at){
      const d = new Date(props.cardData.created_at)
      setMessageDate(`${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`) 
    }
  }, [props.cardData])


  const options = {day: 'numeric', month: "long", year: "numeric"};
  const date = props.cardData.created_at ? new Date(props.cardData.created_at).toLocaleDateString('default', options ) : "n.d.";

  function handleMouseOver(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", true)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
    setIsHovered(true);

    // .attr('fill', "rgba(119, 153, 141, 0.5)")
    // .attr("stroke", 'rgba(119, 153, 141, 1)')
  }
  function handleMouseOut(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", false)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr("r", 5)

    setIsHovered(false);
  }

  const cleanSummary = props.cardData.fr
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/^-/, '').replace(/^[0-9]+/, '')
    .replace(/^\./, "")

  if (!props.cardData.message) {
    console.log(props.cardData);
  }

  useEffect(()=>{

    if(props.expandSpecificCard && props.expandSpecificCard.cardType === 'featureRequest' && props.expandSpecificCard.cardId === props.cardData.fr_id){
        messageCardRef.current.scrollIntoView()
        setIsCardExpanded(true)

    }
  }, [props.expandSpecificCard])


  return (
    <div
      className='messageCard relative'
      onMouseOver={event => handleMouseOver(event, props.cardData.fr_id)}
      onMouseOut={event => handleMouseOut(event, props.cardData.fr_id)}
      ref={messageCardRef}
    >
      <div className='messageCardOuter' onClick={() => setIsCardExpanded(!isCardExpanded)}>
      <div className='messageCardMetadata'>
        <p className='messageCardMetadataText'>@{props.cardData && props.cardData.author}</p>
        <div className='messageCardDivider'></div>
        <p className='messageCardMetadataText'>{messageDate}</p>
      </div>
      <div
  
        className="messageCardInner"
      >
        <p className='messageCardInnerText'>{props.cardData && cleanSummary}</p>
        {props.cardData?.score && <b> [{parseFloat(props.cardData.score).toPrecision(3)}]</b>}
      </div>

      {(isCardExpanded || isExpanded) && (
        <div
            className={cn(
              "flex flex-col gap-2 px-3 py-2 text-sm tracking-tight text-gray-600/90 font-normal",
            )}>
          <div className='messageCardInnerWrapper'>
              <div className='messageCardTextIconWrapper'>
                <BiMessageSquareDetail style={{color: 'rgba(31, 41, 55, 0.6)', fontSize: "20px"}}/>
              </div>
              <div className='messageCardExpandedTextWrapper'>
                <p className='messageCardExpandedText'>{props.cardData.message}</p>
              </div>
          </div>
          
            
        </div>
      )}
    </div>
    <div className='absolute top-1 -left-8'>
          <AiOutlinePushpin
            size={22}
            onClick = {() => pinCard(props.cardData.fr_id)}
            className={cn(
              "bg-slate-200 cursor-pointer hover:bg-slate-300 rounded-full m-1 p-1",
              {"visible": isHovered || isPinned},
              {"invisible": !isHovered && !isPinned}
            )} />
      </div>
    </div>
  )
}
