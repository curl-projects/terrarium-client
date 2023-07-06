import { useState, useEffect, useRef } from "react";
import MessageCard from "~/components/MessageStream/MessageCard";

export default function AuthorCard(props){
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    const authorCardRef = useRef();

    useEffect(()=>{
        !props.isExpanded && setIsCardExpanded(false)
    }, [props.isExpanded])

    return(
        <div className='authorCard relative'>
            <div onClick={() => setIsCardExpanded(!isCardExpanded)} style={{cursor: 'pointer'}} className='clusterCardOuter'>
                <div ref={authorCardRef} className='authorCardInner' >
                    <p className='authorCardTitle'>{props.authorData[0].featureRequest.author}</p>
                    <div style={{flex: 1}}/>
                    <div>
                        <p className='clusterCardTitleMetadata'>{props.authorData.length} {props.authorData.length === 1 ? "Feature Request" : "Feature Requests"}</p>
                    </div>
                </div>
            </div>


            {(isCardExpanded || props.isExpanded) && (
            <div className="authorCardColumn">
                <div className="pl-10 pr-8 flex flex-col gap-2" style={{backgroundColor: "rgb(243, 244, 246)"}}>
                    {props.authorData.map((cardData, idx) => (
                    <MessageCard
                        idx={idx}
                        key={cardData.featureRequest.fr_id}
                        cardData={cardData.featureRequest}
                        cardScore={cardData.score}
                        isExpanded={props.isExpanded}
                        pinCard={props.pinCard}
                        isPinned={props.pinnedCards.map(i => i.featureRequestId).includes(cardData.featureRequestId)}
                        placeholder={props.placeholder}
                    />
                    ))}
                </div>
            </div>
            )}
        </div>
    )
}