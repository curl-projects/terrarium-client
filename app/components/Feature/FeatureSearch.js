import { useState } from "react";
import ExampleDataset from "../Datasets/ExampleDataset";
import { Fade } from "react-awesome-reveal";
import { ImSearch } from "react-icons/im"

export default function FeatureSearch(props){

    const [searchText, setSearchText] = useState("")
    const [selectedDatasets, setSelectedDatasets] = useState([])

    return(
    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        paddingLeft: props.placeholder & "5%",
        paddingRight: props.placeholder & "5%"
        }}>
        <div className='featureSearchInnerWrapper'>
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
                    onClick={()=>console.log('hi!')}
                    >
                    <ImSearch 
                        className='searchIconText'
                        style={{
                            width: "40px",
                            height: "40px",
                        }}/>
                </button>
            }
        </div>
        <div className='pageTitleDivider'/>
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