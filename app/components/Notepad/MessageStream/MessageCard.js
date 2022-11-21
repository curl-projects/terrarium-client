import { useState } from 'react';
import * as d3 from 'd3';
import cn from "classnames";

import { AiOutlinePushpin } from "react-icons/ai";


export default function MessageCard({ isExpanded, isPinned, pinCard, ...props}) {

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  // const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (props.cardData.fr == "Wider Page") {
    console.log(props.cardData);
  }

  // const options = {day: 'numeric', month: "long", year: "numeric"};
  // const date = props.cardData.created_at ? new Date(props.cardData.created_at).toLocaleDateString('default', options ) : "n.d.";

  function handleMouseOver(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", true)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr('stroke', 'red')
      .attr("r", 20)

    setIsHovered(true);
  }
  function handleMouseOut(event, fr_id) {
    d3.select(`#fr-${fr_id}`)
      .classed("mouseOverFr", false)
      .transition()
      .duration(200)
      .ease(d3.easeCubicInOut)
      .attr("r", 5)
      .attr('stroke', 'none')

    setIsHovered(false);
  }

  const cleanSummary = props.cardData.fr
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/^-/, '').replace(/^[0-9]+/, '')
    .replace(/^\./, "")

  if (!props.cardData.message) {
    console.log(props.cardData);
  }

  return (
    <div
      className='messageCard relative'
      onMouseOver={event => handleMouseOver(event, props.cardData.fr_id)}
      onMouseOut={event => handleMouseOut(event, props.cardData.fr_id)}
    >
      <div
        onClick={() => setIsCardExpanded(!isCardExpanded)}
        className={cn(
          'bg-white px-1 py-1 cursor-pointer tracking-tight  leading-5 text-sm text-gray-600 font-medium',
          {"text-gray-800": isHovered}
        )}
      >
        {props.cardData && cleanSummary}
        {props.cardData?.score && <b> [{parseFloat(props.cardData.score).toPrecision(3)}]</b>}
      </div>

      {(isCardExpanded || isExpanded) && (
        <div
          className={cn(
            "flex flex-col gap-2 px-3 py-2 text-sm tracking-tight text-gray-600/90 font-normal",
          )}>
          <p className='mt-2'><span className='text-gray-400'>@</span>{props.cardData && props.cardData.author}</p>
          <p className=' text-gray-700 leading-5'>{props.cardData.message}</p>


          <p><b>Metadata:</b></p>
          <p>Index: {props.idx}</p>
          <p>Feature Request Id: {props.cardData.fr_id}</p>
        </div>
      )}

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
