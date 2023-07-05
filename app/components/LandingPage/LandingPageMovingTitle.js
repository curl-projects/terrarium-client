import { useEffect, useState } from 'react'
import TextTransition, { presets } from 'react-text-transition';

export default function LandingPageMovingTitle(props){

    const typeValues = ["Anything", 'Bug Reports', 'Feature Requests', 'Common Topics']
    const platformValues = ["Anywhere", 'Discord', 'Slack', 'Telegram', 'CSV',]
    const [typeIndex, setTypeIndex] = useState(0);
    const [platformIndex, setPlatformIndex] = useState(0);

    useEffect(()=>{
        const intervalId = setInterval(
            () => {
                setTypeIndex((typeIndex) => typeIndex + 1)
                setPlatformIndex((platformIndex) => platformIndex + 1)
            },
            2000
        );

        return () => clearTimeout(intervalId)
    }, [])


    return(
    <div className='pageTitleOuterWrapper' 
        style={{
            flex: props.leftSide ? "1.2" : "unset"
        }}>
        <div className='pageTitle' style={{textAlign: "center"}}>
            <h1 className='landingPageTitleText'>
                Classify and extract
                <TextTransition
                   inline={true}
                   direction='down'
                   springConfig={presets.gentle} 
                   className='landingPageTitleChangingText'
                   style={{marginLeft: "10px", marginRight: "10px", color: "#B0BFB9"}}
                >
                    {typeValues[typeIndex % typeValues.length]}
                </TextTransition>
                
                from 
                <TextTransition
                   inline={true}
                   direction='up'
                   springConfig={presets.gentle} 
                   style={{marginLeft: "10px", marginRight: "10px"}}
                   className='landingPageTitleChangingText'
                >
                    {platformValues[platformIndex % platformValues.length]}
                </TextTransition>
                ...
            </h1>
            <div className='pageTitleDivider'/>
        </div>
        <div className='pageTitleDescription' style={{justifyContent: 'center'}}>
            <p className='pageTitleDescriptionText'>{props.description || "No description"}</p>
        </div>
    </div>
    )
}