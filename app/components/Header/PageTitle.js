import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from 'react';

export default function PageTitle(props){

    useEffect(()=>{
        console.log("FETCHER STATE:", props.fetcher?.state)
    }, [props.fetcher])

    return(
    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        paddingLeft: props.placeholder & "5%",
        paddingRight: props.placeholder & "5%",
        }}>
        <div className='pageTitle'>
            <h1 className='pageTitleText' style={{
                textAlign: props.centered ? "center" : "left",
            }}>{props.title}</h1>
            <div className='pageTitleDivider'/>
            {props.fetcher && (props.fetcher.state === "submitting" || props.fetcher.state === 'loading')  &&
                    <LinearProgress 
                        variant="indeterminate"
                        style={{width: "100%", 
                                height: "2px", 
                                backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                    />
            }
        </div>
        <div className='pageTitleDescription' style={{
            justifyContent: props.centered ? "center" : "left",
        }}>
            <p className='pageTitleDescriptionText' style={{
                textAlign: props.centered ? "center" : "left",
            }}>{props.description}</p>
        </div>
    </div>
    )
}