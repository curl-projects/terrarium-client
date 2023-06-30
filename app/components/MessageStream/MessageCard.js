import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cn from "classnames";
import { BsChatLeftText } from "react-icons/bs";
import { AiOutlinePushpin } from "react-icons/ai";
import { BiMessageSquareDetail } from 'react-icons/bi'
import Highlighter from "react-highlight-words";

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

  useEffect(()=>{
    !isExpanded && setIsCardExpanded(false)
  }, [isExpanded])


  return (
    <div
      className='messageCard relative'
      onMouseOver={event => handleMouseOver(event, props.cardData.fr_id)}
      onMouseOut={event => handleMouseOut(event, props.cardData.fr_id)}
      ref={messageCardRef}
      style={props.style && {...props.style}}
    >
      <div className='messageCardOuter' onClick={() => setIsCardExpanded(!isCardExpanded)}>
      <div className='messageCardMetadata'>
        <p className='messageCardMetadataText'>@{props.cardData && props.cardData.author}</p>
        <div className='messageCardDivider' />
        <p className='messageCardMetadataText'>{messageDate}</p>
        <div className='messageCardDivider' />
        <p className='messageCardMetadataText'>{parseFloat(props.cardScore).toPrecision(2)*100}% Relevant</p>


      </div>
      <div
  
        className="messageCardInner"
      >
          <p className='messageCardInnerText'> 
            <Highlighter 
              searchWords={[props.searchText]} 
              textToHighlight={props.cardData && cleanSummary}
              highlightClassName="highlightedFeatureRequestText"
              >

            </Highlighter>
          </p>
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
    <div className='pushPinWrapper'>
          <AiOutlinePushpin
            size={22}
            onClick = {() => pinCard(props.cardData.fr_id)}
            style={props.pushPinStyle && {...props.pushPinStyle }}
            className={cn(
              "pushPin",
              {"visible": isHovered || isPinned},
              {"invisible": !isHovered && !isPinned}
            )} />
      </div>
    </div>
  )
}
