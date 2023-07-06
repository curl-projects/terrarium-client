import { useEffect, useState } from 'react'
import { BsToggleOff } from "react-icons/bs"
import { BiToggleLeft, BiToggleRight } from "react-icons/bi"
import { Fade } from "react-awesome-reveal";

export default function LandingPageMessageStreamTitle(props){

    return(
    <div className='pageTitleOuterWrapper' 
        style={{
            flex: props.leftSide ? "1.2" : "unset"
        }}>
        <Fade 
            className='pageTitle' 
            delay={0}
            fraction={0.9}
            triggerOnce={true}
            
            style={{
            textAlign: "center",
            display: 'flex',
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <h1 className='landingPageTitleText'>
                ...using a finely tuned pipeline to summarise relevant messages 
            </h1>
            <div className='pageTitleDivider' style={{width: "80%", marginTop: "10px"}}/>
        </Fade>
        <Fade fraction={0.9} delay={300} triggerOnce={true}>
        <div className='pageTitleDescription' style={{justifyContent: 'center'}}>
            <button onClick={() => props.setMessageStreamIsExpanded(prevState => !prevState)}>
                <p className='pageTitleBoldedDescriptionText' style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>{props.messageStreamIsExpanded ? "Hide" : "Show"} Original Messages 
                <span style={{display: 'flex', alignItems: 'center', justifyContent: "center", marginLeft: '6px'}}>
                    {props.messageStreamIsExpanded ? <BiToggleRight /> : <BiToggleLeft />}
                </span>
                </p>
            </button>
        </div>
        </Fade>
    </div>
    )
}