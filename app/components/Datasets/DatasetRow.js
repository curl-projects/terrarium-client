import { useState, useEffect, useReducer } from "react";
import { BsFileArrowUp} from "react-icons/bs";
import { TbRefreshDot } from "react-icons/tb";
import { BsX } from "react-icons/bs";
import Tooltip from '@mui/material/Tooltip';

function reducer(state, action){
    switch(action.type){
        case "deleting_file":
            return {...state, datasetStatus: "Deleting File..."}
        case 'unprocessed':
            return {...state, datasetStatus: "Dataset Unprocessed"}
        case 'request_initiated':
            return {...state, datasetStatus: "Request Initiated"}
        case 'server_contacted':
            return {...state, datasetStatus: "Server Contacted (1/4)"}
        case 'frs_generated':
            return {...state, datasetStatus: "Feature Requests Generated (2/4)"}
        case 'vectors_generated':
            return {...state, datasetStatus: "Vectors Generated (3/4)"}
        case 'dataset_generated':
            return {...state, datasetStatus: "Dataset Generated (4/4)"}
        case 'known_error':
            return {...state, datasetStatus: "Known Error"}
        case 'unknown_error':
            return {...state, datasetStatus: "Unknown Error"}
        default:
            return {...state}
    }
}

export default function DatasetRow(props){
    const [state, dispatch] = useReducer(reducer, { datasetStatus: "Request Initiated", datasetSize: ""});
    const [datasetSize, setDatasetSize] = useState("");

    useEffect(()=>{
        console.log("LAST MESSAGE:", props.lastMessage)
        props.lastMessage?.data && JSON.parse(props.lastMessage.data).dataset === props.row.uniqueFileName &&  dispatch({ type: JSON.parse(props.lastMessage.data).type})
        if(props.lastMessage?.data && JSON.parse(props.lastMessage.data).dataset === props.row.uniqueFileName && JSON.parse(props.lastMessage.data).type === 'frs_generated'){
            setDatasetSize(JSON.parse(props.lastMessage.data).status)
        }
    }, [props.lastMessage])

    useEffect(()=>{
        props.row?.status && dispatch({type: props.row.status})
    }, [props.row.status])

    useEffect(()=>{
        props.row?.size && setDatasetSize(props.row.size)
    }, [props.row])
 
    useEffect(()=>{
        props.deleteFetcher.state === 'submitting' && (props.row.uniqueFileName === props.activelyDeletingFile) && dispatch({type: "deleting_file"})
    }, [props.deleteFetcher])

    function reprocessClusters(){
        if(!props.placeholder){
            props.setUpdateExistingDataset(true)
        props.setExistingDataset(props.row)
        props.setColumnValues({'text': props.row.datasetMapping.text,'author': props.row.datasetMapping.author, "created_at": props.row.datasetMapping.createdAt, "id": props.row.datasetMapping.id, "searchFor": props.row.datasetMapping.searchFor})
        props.handleUnprocessedDatasetClick(props.row.baseDataset.uniqueFileName, props.row.baseDataset.baseDatasetId)
        }
    }

    function handleDelete(){
        if(!props.placeholder){
            props.setActivelyDeletingFile(props.row.uniqueFileName)
            props.deleteFetcher.submit({datasetId: props.row.datasetId, uniqueFileName: props.row.uniqueFileName}, 
                                   {method: "post", action: "/utils/delete-dataset"})
        }
    }

    return(
        <div className='processedFileOuterWrapper' style={{
            opacity: props.highlightedProcessedDatasets !== 'default' && !props.highlightedProcessedDatasets.includes(props.row.datasetId) && "0.7"
        }}>
            <div className='fileCardBookmark'
                style={{
                    width: props.highlightedProcessedDatasets.includes(props.row.datasetId) && "12px",
                }}
            />
            <div className='fileInnerWrapper' style={{padding: "10px"}}>
                <div className='fileTitleRow'>
                    <div className='fileTitleWrapper'>
                        <p className='fileTitle'>{props.row.uniqueFileName || `Untitled (${props.idx})`}</p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='fileRemoveWrapper'>
                        {/* {props.exampleDataset ?  */}
                        { false ?
                        <>  
                            <div className='exampleDatasetBanner'>
                                <p className='exampleDatasetBannerText'>Example</p>
                            </div>
                        </>
                        :
                        <>
                            <Tooltip title="Reprocess Dataset" placement='top' arrow>
                                <div>
                                    <TbRefreshDot
                                        onClick={reprocessClusters}
                                        style={{fontSize: "20px", color: "rgba(75, 85, 99, 0.8)", cursor: "pointer"}}
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip title="Delete Dataset" placement='top' arrow>
                                <div>
                                    <BsX 
                                        onClick={handleDelete}
                                        style={{fontSize: "28px", color: "rgba(75, 85, 99, 0.95)", cursor: "pointer"}}/>
                                </div>
                            </Tooltip>
                        </>
                        }
                    </div>
                </div>
                <div>
                    <p className='fileCardStatus'>{state.datasetStatus || ""} | {datasetSize ? String(datasetSize).concat(" Feature Requests") : "Unknown Size"} </p>
                </div>
                {/* <div className='fileMetadataRow'>
                    <div className='fileMetadataWrapper'>
                        <p className='fileMetadata'>{datasetSize ? String(datasetSize).concat(" Feature Requests") : "Unknown Size"}</p>
                        <div className='fileMetadataDivider' />
                    </div>
                </div> */}
            </div>
        </div>
    )
}