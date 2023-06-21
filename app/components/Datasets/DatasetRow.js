import { useState, useEffect, useReducer } from "react";
import { BsFileArrowUp} from "react-icons/bs";
import { BsX } from "react-icons/bs";


function reducer(state, action){
    switch(action.type){
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
        props.lastMessage?.data && dispatch({ type: JSON.parse(props.lastMessage.data).type})
        if(props.lastMessage?.data && JSON.parse(props.lastMessage.data).type === 'frs_generated'){
            setDatasetSize(JSON.parse(props.lastMessage.data).status)
        }
    }, [props.lastMessage])

    useEffect(()=>{
        props.row?.status && dispatch({type: props.row.status})
    }, [props.row.status])

    useEffect(()=>{
        props.row?.size && setDatasetSize(props.row.size)
    }, [props.row])



    return(
        <div className='fileOuterWrapper' >
                    <div className='fileIconWrapper'>
                        <BsFileArrowUp style={{fontSize: "26px", color: "rgba(75, 85, 99, 0.85)"}}/>
                    </div>
                    <div className='fileContentWrapper'>
                        <div className='fileTitleWrapper'>
                            <p className='fileTitle'>{props.row.uniqueFileName.split("-").slice(1).join("-") || `Untitled (${props.idx})`}</p>
                        </div>
                        <div className='fileMetadataWrapper'>
                            <p className='fileMetadata'>{datasetSize ? String(datasetSize).concat(" Feature Requests") : "Unknown Size"}</p>
                            <div className='fileMetadataDivider' />
                            <p className='fileMetadata'>{state.datasetStatus || ""}</p>
                        </div>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='fileRemoveWrapper'>
                        <BsX 
                            onClick={()=>props.deleteFetcher.submit({datasetId: props.row.datasetId, uniqueFileName: props.row.uniqueFileName}, {method: "post", action: "/utils/delete-dataset"})}
                            style={{fontSize: "28px", color: "rgba(75, 85, 99, 0.95)", cursor: "pointer"}}/>
                    </div>
            </div>
    )
}