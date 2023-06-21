import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect, useReducer } from "react";

import { BiDotsHorizontalRounded } from "react-icons/bi"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


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
    const [datasetSize, setDatasetSize] = useState("")

    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

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
        <TableRow key={props.idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align="left">{props.row.uniqueFileName.split("-").slice(1).join("-") || `Untitled (${props.idx})`}</TableCell>
            <TableCell align="left">{datasetSize || ""}</TableCell>
            <TableCell align="left">{state.datasetStatus || ""}</TableCell>
            <TableCell align="center">
                <BiDotsHorizontalRounded onClick={handleClick} style={{cursor: "pointer"}}/>
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                        <button onClick={()=>props.deleteFetcher.submit({datasetId: props.row.datasetId, uniqueFileName: props.row.uniqueFileName}, {method: "post", action: "/utils/delete-dataset"})}><p>Delete Dataset</p></button>
                    </MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    )
}