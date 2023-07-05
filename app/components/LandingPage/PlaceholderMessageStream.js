import { TextField } from "@mui/material"
import { useState, useEffect } from "react"
import MessageCard from "../MessageStream/MessageCard"
import { IoExpand, IoContract } from 'react-icons/io5';
import {AiOutlineArrowUp} from 'react-icons/ai';
import { BsX } from "react-icons/bs"

export default function PlaceholderMessageStream(props){
    const [searchText, setSearchText] = useState("")
    const [pinnedCards, setPinnedCards] = useState([])
    const [remainingCards, setRemainingCards] = useState([])

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }      

    const placeholderMessages = {
        pinnedCards: [
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
        ],
        remainingCards: [
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
            {
                featureId: 49,
                featureRequest: {
                    author: "placeholder",
                    created_at: "2022-07-23 14:40:43.448000+00:00",
                    datasetId: 67,
                    fr: "Allow users to easily make text bigger or smaller on whiteboards",
                    fr_id: "v9i1016033012674203718-5668007867967131344",
                    message: "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image."
                },
                pinned: true,
                score: "0.843808234"
            },
        ]
    }

    useEffect(()=>{
        setPinnedCards(placeholderMessages.pinnedCards)
        setRemainingCards(placeholderMessages.remainingCards)
    }, [])


    return(
        <div className='placeholderMessageStreamOuter'>

        <div className='messageStreamMetadataWrapper' style={{backgroundColor: 'white'}}>
            <div className='messageStreamMetadataSection'>
                <p className='messageStreamMetadataText'>
                <span className="messageStreamMetadataIcon">{numberWithCommas(placeholderMessages.pinnedCards.length + placeholderMessages.remainingCards.length)}</span>
                Feature Requests
                </p>
            </div>
        
            <div style={{flex: 1}}/>

            <div style={{display: 'flex'}}>

                <AiOutlineArrowUp 
                size = {20}
                className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full  p-1 text-gray-500"
                onClick = {() => scrollToTop()}
                />

                <div onClick={() => props.setMessageStreamIsExpanded(!props.messageStreamIsExpanded)}>
                {props.messageStreamIsExpanded ?
                    <IoContract size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full  p-1 text-gray-500" /> :
                    <IoExpand size={22} className="inline-block bg-slate-50 cursor-pointer hover:bg-white rounded-full p-1 text-gray-500" />}
                </div>
            </div>
        </div>



        <div className='placeholderMessageStream'>
            <div className="pl-10 pr-8 flex flex-col gap-2">
                <div className='featureRequestSearchWrapper'>
                    <TextField 
                        label="Search" 
                        InputProps={{ inputProps: { tabIndex: -1 } }} 
                        className='featureRequestSearchTextField'
                        value={searchText}
                        onChange={(e)=> {
                            setSearchText(e.target.value)
                        }}
                        />
                    {searchText && 
                        <button
                        className='filterOptionButton'
                        onClick={() => setSearchText("")}>
                            <BsX style={{fontSize: "34px"}}/>
                        </button>   
                    }
                </div>
                {pinnedCards.map((cardData, idx) => (
                    <MessageCard
                    style={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                    idx={idx}
                    key={idx}
                    cardData={cardData.featureRequest}
                    cardScore={cardData.score}
                    isExpanded={props.messageStreamIsExpanded}
                    searchText={searchText}
                    isPinned={true}/>
                ))}
                {pinnedCards.length > 0 && <h1 className="text-gray-400 text-xs font-medium pl-4">Unpinned Feature Requests</h1>}
                {remainingCards.map((cardData, idx) => (
                    <MessageCard
                    style={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                    pushPinStyle={{boxShadow: "1px 1px 10px 1px #0000001a"}}
                    idx={idx}
                    searchText={searchText}
                    key={idx}
                    cardData={cardData.featureRequest}
                    cardScore={cardData.score}
                    isExpanded={props.messageStreamIsExpanded}
                    />
                ))}
            </div>
        </div>  
        </div>
    )
}