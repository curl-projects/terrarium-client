import { useEffect, useState } from 'react'
import { BsToggleOff } from "react-icons/bs"
import { BiToggleLeft, BiToggleRight } from "react-icons/bi"
import { BsBoxArrowInUpRight, BsArrowUpRight } from "react-icons/bs"
import { FiArrowUpRight } from "react-icons/fi"
import { SocialsProvider } from "remix-auth-socials";
import { useSubmit } from '@remix-run/react';
import { RiPlantLine } from 'react-icons/ri'

import { Fade } from "react-awesome-reveal";

export default function LandingPageWaitListTitle(props){
    const submit = useSubmit()

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
                Social analytics for anything from anywhere.
            </h1>
            <div className='pageTitleDivider' style={{width: "80%"}}/>
        </div>
        <div className='pageTitleDescription' style={{justifyContent: 'center', gap: "20px"}}>
            <Fade fraction={1} triggerOnce={true}>
            <p 
                className='pageTitleBoldedDescriptionText'
                onClick={() => {
                    submit(null, {method: "post", "action": `/auth/${SocialsProvider.GOOGLE}`})
                }}
                style={{display: 'flex', alignItems: "center", justifyContent: "center", cursor: "pointer"}}> Create an Account
                <span style={{display: 'flex', alignItems: 'center', justifyContent: "center", marginLeft: '6px'}}>
                    <RiPlantLine/>
                </span>
            </p>
            </Fade>
            <Fade fraction={1} delay={300} triggerOnce={true}>
                <a href="https://discord.gg/UpZ3rA47uj" target="_blank" className='waitlistCallToAction'>
                    <p className='pageTitleBoldedDescriptionText' style={{display: 'flex', alignItems: "center", justifyContent: "center"}}> Join the Discord 
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: "center", marginLeft: '6px'}}>
                        <FiArrowUpRight />
                    </span>
                    </p>
                </a>
            </Fade>
        </div>
    </div>
    )
}