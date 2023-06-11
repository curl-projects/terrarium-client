import MessageCard from "~/components/MessageStream/MessageCard";

export default function MessageStreamFeatureRequests(props){
    return(
        <>
        {props.pinnedCards.map((cardData, idx) => (
            <MessageCard
              idx={idx}
              key={cardData.featureRequest.fr_id}
              cardData={cardData.featureRequest}
              isExpanded={props.isExpanded}
              pinCard={props.pinCard}
              isPinned={true}/>
          ))}
          {props.pinnedCards.length > 0 && <h1 className="text-gray-400 text-xs font-medium pl-4">Remaining Feature Requests</h1>}
          {props.remainingCards.map((cardData, idx) => (
            <MessageCard
              idx={idx}
              key={cardData.featureRequest.fr_id}
              cardData={cardData.featureRequest}
              isExpanded={props.isExpanded}
              pinCard={props.pinCard} />
          ))}
        </>
    )
}