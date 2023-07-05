import { useEffect, useState } from 'react'
import { BsToggleOff } from "react-icons/bs"
import { BiToggleLeft, BiToggleRight } from "react-icons/bi"

export default function LandingPageMessageStreamTitle(props){

    return(
    <div className='pageTitleOuterWrapper' 
        style={{
            flex: props.leftSide ? "1.2" : "unset"
        }}>
        <div className='pageTitle' style={{
            textAlign: "center",
            display: 'flex',
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <h1 className='landingPageTitleText'>
                ...using a finely tuned pipeline to summarise relevant messages 
            </h1>
            <div className='pageTitleDivider' style={{width: "80%"}}/>
        </div>
        <div className='pageTitleDescription' style={{justifyContent: 'center'}}>
            <button onClick={() => props.setMessageStreamIsExpanded(prevState => !prevState)}>
                <p className='pageTitleBoldedDescriptionText' style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>{props.messageStreamIsExpanded ? "Hide" : "Show"} Original Messages 
                <span style={{display: 'flex', alignItems: 'center', justifyContent: "center", marginLeft: '6px'}}>
                    {props.messageStreamIsExpanded ? <BiToggleRight /> : <BiToggleLeft />}
                </span>
                </p>
            </button>
        </div>
    </div>
    )
}