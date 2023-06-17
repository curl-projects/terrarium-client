import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from "react";

 
export default function DatasetRow(props){
    const [datasetStatus, setDatasetStatus] = useState("unprocessed")

    useEffect(()=>{
        setDatasetStatus(props.row.status)
    }, [props.row])
    return(
        <TableRow key={props.idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align="left">{props.row.uniqueFileName.split("-").slice(1).join("-") || `Untitled (${props.idx})`}</TableCell>
            <TableCell align="left">{props.row.size ? props.row.size : "Unknown"}</TableCell>
            <TableCell align="left">{datasetStatus}</TableCell>
        </TableRow>
    )
}