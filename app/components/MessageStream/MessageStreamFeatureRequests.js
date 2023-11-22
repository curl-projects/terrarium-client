import MessageCard from "~/components/MessageStream/MessageCard";
import TextField from '@mui/material/TextField';
import { BsX } from "react-icons/bs";

export default function MessageStreamFeatureRequests(props){
    return(
        <div className="pl-10 pr-8 flex flex-col gap-2" style={{backgroundColor: "rgb(243, 244, 246)"}}>
            <div className='featureRequestSearchWrapper'>
            <input 
                    className='featureRequestSearchTextField'
                    onKeyPress={(e)=>{e.key === "Enter" && e.preventDefault();}}
                    value={props.searchText}
                    placeholder='Search'
                    onChange={(e)=> {
                        props.setSearchText(e.target.value)
                    }}
            />
                {props.searchText && 
                    <button
                    className='filterOptionButton'
                    onClick={() => props.setSearchText("")}>
                        <BsX style={{fontSize: "34px"}}/>
                    </button>   
                }
            </div>
            {props.pinnedCards.map((cardData, idx) => (
                <MessageCard
                style={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                idx={idx}
                key={cardData.featureRequest.fr_id}
                cardData={cardData.featureRequest}
                cardScore={cardData.score}
                isExpanded={props.isExpanded}
                pinCard={props.pinCard}
                expandSpecificCard={props.expandSpecificCard}
                searchText={props.searchText}
                isPinned={true}
                placeholder={props.placeholder}
                />
            ))}
            {props.pinnedCards.length > 0 && <h1 className="text-gray-400 text-xs font-medium pl-4">Unpinned Feature Requests</h1>}
            {props.remainingCards.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).map((cardData, idx) => (
                <MessageCard
                style={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                pushPinStyle={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                idx={idx}
                searchText={props.searchText}
                key={cardData.featureRequest.fr_id}
                cardData={cardData.featureRequest}
                cardScore={cardData.score}
                isExpanded={props.isExpanded}
                expandSpecificCard={props.expandSpecificCard}
                pinCard={props.pinCard}
                placeholder={props.placeholder}
                />
            ))}
        </div>
    )
}