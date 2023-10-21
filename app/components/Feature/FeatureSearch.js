import { useState, useEffect } from "react";
import ExampleDataset from "../Datasets/GeneralDataset";
import { Fade } from "react-awesome-reveal";
import { ImSearch } from "react-icons/im"
import { Form, useTransition } from "@remix-run/react";
import LinearProgress from '@mui/material/LinearProgress';

export default function FeatureSearch(props){

    const [searchText, setSearchText] = useState("")
    const [selectedDatasets, setSelectedDatasets] = useState([])
    const navigate = useTransition();

    useEffect(()=>{
        console.log("NAVIGATE", navigate.type)
    }, [navigate])

    return(
    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        paddingLeft: props.placeholder & "5%",
        paddingRight: props.placeholder & "5%"
        }}>
        <Form className='featureSearchInnerWrapper' method='post'>
            <input type="hidden" name="computedRankState" value={props.colStateWatcher.length + 1}/>
            <input type="hidden" name='searchTerm' value={searchText} />
            <input type="hidden" name="selectedDatasets" value={selectedDatasets} />
            <input type="hidden" name="actionType" value="search" />
            <input 
                className='featureSearchInput' 
                placeholder='Search'
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
        <div className='featureSearchDescription'>
            <p className='featureSearchDescriptionText'>Create and organise features.</p>
        </div>
        {searchText !== "" &&
            <Fade>
                <div className="featureSearchDatasetSelector">
                    {props.datasets.map((dataset, index)=>
                            <ExampleDataset 
                                title={dataset.readableName}
                                uniqueFileName={dataset.uniqueFileName}
                                key={dataset.datasetId}
                                selected={selectedDatasets.includes(dataset.uniqueFileName)}
                                selectedDatasets={selectedDatasets}
                                setSelectedDatasets={setSelectedDatasets}
                                />
                        )}
                </div>
            </Fade>
        }
    </div>
    )
}