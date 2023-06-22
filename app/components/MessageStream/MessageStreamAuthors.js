import { useState, useEffect } from 'react';
import AuthorCard from "~/components/MessageStream/AuthorCard"

export default function MessageStreamAuthors(props){
    const [allCardsStatus, setAllCardsStatus] = useState([])

    useEffect(()=>{
        console.log("PINNED:", props.pinnedCards)
    }, [props.pinnedCards])

    useEffect(()=>{
        let tempObject = {}
        props.authorData && props.authorData.map((authorData, idx) => (
            tempObject[idx] = {expanded: false}
        ))

        setAllCardsStatus(tempObject)
    }, [props.authorData])

    

    return(
        <div>
            <div className="pl-10 pr-8 flex flex-col gap-2" style={{backgroundColor: "rgb(243, 244, 246)"}}>
                {props.authorData && props.authorData.map((authorData, idx) => 
                    <AuthorCard 
                    key={idx} 
                    authorData={authorData} 
                    allCardsStatus={allCardsStatus}
                    pinCard={props.pinCard}
                    isExpanded={props.isExpanded}
                    pinnedCards={props.pinnedCards}
                    />
                )}
            </div>
        </div>
    )
}