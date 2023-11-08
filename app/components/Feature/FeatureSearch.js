import { useState, useEffect } from "react";
import ExampleDataset from "../Datasets/GeneralDataset";
import { Fade } from "react-awesome-reveal";
import { ImSearch } from "react-icons/im"
import { Form, useTransition } from "@remix-run/react";
import LinearProgress from '@mui/material/LinearProgress';
import TextTransition, { presets } from 'react-text-transition';
import LargeExampleDataset from "../Datasets/LargeExampleDataset";

export default function FeatureSearch(props){

    const [searchText, setSearchText] = useState("")
    const [selectedDatasets, setSelectedDatasets] = useState([])
    const displayExampleQuestions = [
        "How can I improve the usability of my tagging system?",
        "What are people most frustrated by?",
        "How can I improve my developer tools?",
        "Should I build a new interface for my newsfeed?",
        "What journalling functionality are people asking for most often?",
        "What should I build next?",
        "Should I build a system that allows users to upvote other people's content?",
        "Do people want to use my application offline?",
        "Which competitors should I be looking into?",
    ]
    const [displayText, setDisplayText] = useState("placeholder")
    const navigate = useTransition();

    useEffect(()=>{
        console.log("NAVIGATE", selectedDatasets)
    }, [selectedDatasets])

    useEffect(()=>{
        if(searchText === ""){
            setDisplayText(displayExampleQuestions[Math.floor(Math.random()*displayExampleQuestions.length)])
            const intervalId = setInterval(
                () => {
                    setDisplayText(displayExampleQuestions[Math.floor(Math.random()*displayExampleQuestions.length)])
                },
                2000
            );
    
            return () => clearTimeout(intervalId)
        }
        else{
            if(props.datasets.length === 0){
                setDisplayText("Add datasets in the Data Sources panel to ask a question")
            }
            else{
                setDisplayText("Select the discussions you want to search through")
            }
        }
        
    }, [searchText])

    useEffect(()=>{
        (navigate.type === "actionSubmission" || navigate.type === 'actionRedirect')  && setDisplayText("Finding all relevant conversations...")
    }, [navigate])

    return(

    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        paddingLeft: props.placeholder & "5%",
        paddingRight: props.placeholder & "5%",
        paddingTop: '5vh',
        }}>
        <div style={{display: 'flex', justifyContent: "center", flexDirection: "column"}}>
            <div className='featureSearchDescription'>
            {/* <p className='featureSearchDescriptionDivider'>|</p> */}
            </div>
        </div>
        <Form className='featureSearchInnerWrapper' method='post'>
            <input type="hidden" name="computedRankState" value={props.colStateWatcher.length + 1}/>
            <input type="hidden" name='searchTerm' value={searchText} />
            <input type="hidden" name="selectedDatasets" value={selectedDatasets} />
            <input type="hidden" name="actionType" value="search" />
            <input 
                className='featureSearchInput' 
                placeholder='Ask any question about your communities...'
                value={searchText}
                onChange={(e)=>setSearchText(e.target.value)}
                autoFocus
                >
                {/* <h1 className='pageTitleText'>{props.title}</h1> */}
            </input>
            {searchText !== "" && selectedDatasets.length > 0 &&
                <button 
                    className='searchIconWrapper'
                    type='submit'
                    >
                    <ImSearch 
                        className='searchIconText'
                        style={{
                            width: "40px",
                            height: "40px",
                        }}/>
                </button>
            }
        </Form>
        <div className='pageTitleDivider'/>
        {(navigate.type === "actionSubmission" || navigate.type === 'actionRedirect')  &&
                    <LinearProgress 
                        variant="indeterminate"
                        style={{width: "100%", 
                                height: "2px", 
                                backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                    />
        }

        <TextTransition 
            className='featureSearchDescriptionText'
            direction="up"
            springConfig={presets.gentle}
            >{displayText}
        </TextTransition>

       {searchText !== "" && <div className="featureSearchDatasetSelector">
                <Fade cascade direction='up'>
                    {props.datasets.map((dataset, index)=>
                            <LargeExampleDataset 
                                title={dataset.readableName}
                                uniqueFileName={dataset.uniqueFileName}
                                key={dataset.datasetId}
                                active={selectedDatasets.includes(dataset.uniqueFileName)}
                                selectedDatasets={selectedDatasets}
                                setSelectedDatasets={setSelectedDatasets}
                                description={dataset.description}
                                />
                        )}
                </Fade>
        </div>}
        {searchText !== "" && selectedDatasets.length > 0 &&
            <Form className='featureSearchInnerWrapper' method='post'>
                <input type="hidden" name="computedRankState" value={props.colStateWatcher.length + 1}/>
                <input type="hidden" name='searchTerm' value={searchText} />
                <input type="hidden" name="selectedDatasets" value={selectedDatasets} />
                <input type="hidden" name="actionType" value="search" />
                <div className='exampleDataSourcesNext' style={{
                    display: 'flex',
                    gap: '5px'
                }}>
                    <Fade direction='up'>
                        <button className='exampleDataSourcesNextText' type='submit'>
                            Search
                            <ImSearch style={{
                            display: 'inline',
                            height: '18px',
                            width: '18px',
                            position: "relative",
                            top: "-2px",
                            left: "5px",
                            transform: "rotate(90deg)"
                        }}/>
                        </button>
                    </Fade>
                </div>
            </Form>
        }
    </div>
    )

}