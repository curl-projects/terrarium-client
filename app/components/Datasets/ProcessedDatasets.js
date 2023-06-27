import {useEffect, useState } from "react";
import { useFetcher, Form } from "@remix-run/react";
import { usePapaParse } from 'react-papaparse';
import useWebSocket, { ReadyState } from "react-use-websocket";
import { BiMessageSquareDetail } from 'react-icons/bi'
import { BsPerson } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi"; 
import { BsHash } from "react-icons/bs";
import { BsUpload } from "react-icons/bs";
import DatasetRow from "~/components/Datasets/DatasetRow";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ProcessedDatasets({  processedDatasets, activelyDeletingFile, setActivelyDeletingFile,
                                            readDatasetFetcher, unprocessedFileName, setUnprocessedFileName, baseDatasetId, setBaseDatasetId}){
    const { readString } = usePapaParse();

    const [fileHeaders, setFileHeaders] = useState([])
    const [fileWarning, setFileWarning] = useState("")
    const [columnValues, setColumnValues] = useState({'text': "",'author': "", "created_at": "", "id": "", "searchFor": ""})
    const deleteFetcher = useFetcher()
    const [socketUrl, setSocketUrl] = useState(null);

    function resetFile(){
        setUnprocessedFileName("")
        setFileHeaders([])
        setFileWarning("")
        setColumnValues({'text': "",'author': "", "created_at": "", "id": "", "searchFor": ""})
        setBaseDatasetId("")
    }
    
    // WEB SOCKET CONNECTION
    useEffect(()=>{
        setSocketUrl(window.ENV.WEBSOCKETS_URL)
      }, [])

    useEffect(()=>{
        setFileWarning("")
        setColumnValues({'text': "",'author': "", "created_at": "", "id": "", "searchFor": ""})
    }, [unprocessedFileName])

    const { lastMessage, readyState } = useWebSocket(socketUrl);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(()=>{
        console.debug("CONNECTION STATUS:", connectionStatus)
    }, [connectionStatus])

    
    useEffect(()=>{
        if(readDatasetFetcher.data?.fileContents){
            readString(readDatasetFetcher.data.fileContents, {
                preview: 1,
                complete: function (results) {
                    console.log(results)
                    setFileHeaders(results.data[0])

                    for(let header of results.data[0]){
                        if((header.charAt(0) === "[" && header.charAt(-1) === "]") 
                          || (/^\d+$/.test(header))
                        ){ setFileWarning("It seems like these values might not be headers. Make sure your file has appropriate headers for each column.") } 
                    }
                },
                error: function(error){
                    console.error("File Read Error:", error)
                }
            })
        }
    }, [readDatasetFetcher.data])

    return(
        <>
        <Form method="post" encType="multipart/form-data" className='fileUploadRectangle'>
                    <BsUpload style={{fontSize: "30px", color: "#4b5563"}}/>
                    {unprocessedFileName
                    ? <p className='fileUploadText'>{unprocessedFileName}</p>
                    : <p className='fileUploadText'>Process Dataset</p>
                    }
                    <input type='hidden' name='actionType' value="processedDataset" />
                    <input type='hidden' name='headerMappings' value={JSON.stringify(columnValues)} />
                    <input type='hidden' name='baseDatasetId' value={baseDatasetId} />
                    <input type='hidden' name='uniqueFileName' value={unprocessedFileName} />
                    {!unprocessedFileName && <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>Takes around 10 minutes to process</p>}
                    {unprocessedFileName && <p className='fileUploadSpecifier' onClick={resetFile} style={{color: "rgba(75, 85, 99, 0.8)", cursor: "pointer"}}>Remove File</p>}
                    
                {unprocessedFileName && !(fileHeaders.length === 0) && 
                    <>
                    <div className='fileOptionSeparator'/>
                    <div className='fileOptionWrapper'>
                    <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>Found headers: {fileHeaders.join(", ")}</p>
                    {fileWarning && <p className='fileUploadSpecifier' style={{color: "#7E998E"}}>{fileWarning}</p>}
                        {[{value: 'text', name: "Text", icon: <BiMessageSquareDetail />}, 
                            {value: 'author', name: "Author", icon: <BsPerson />}, 
                            {value: 'id', name: "ID", icon: <BsHash />}, 
                            {value: 'created_at', name: "Created Date", icon: <BiCalendar />}].map((field, idx) => 
                            <div className='fileOptionRow' key={idx}>
                                <div className='fileOptionLabel'>
                                    {/* <div className='fileOptionIconWrapper'>
                                        {field.icon && field.icon}
                                    </div> */}
                                    <p className='fileOptionLabelText'>{field.name}</p>
                                </div>
                                <div className='fileOptionInputWrapper'>
                                    <Select 
                                        className='fileOptionInputSelect'
                                        value={columnValues[`${field.value}`]}
                                        onChange={function(e){
                                            setColumnValues((prevState) => ({...prevState, [field.value]: e.target.value}))
                                        }}
                                    >
                                        {fileHeaders && fileHeaders.map((column, idx) => 
                                            <MenuItem className='fileSelectMenuItem' key={idx} value={column}>{column}</MenuItem>
                                        )}
                                    </Select>
                                </div>
                            </div>
                        )}
                        <div className='fileOptionRow' style={{marginTop: "14px"}}>
                            <div className='fileOptionLabel'>
                                <p className='fileOptionLabelText'>Search For:</p>
                            </div>
                            <div className='fileOptionInputWrapper'>
                                <Select 
                                    className='fileOptionInputSelect' 
                                    value={columnValues['searchFor']}
                                    onChange={function(e){
                                            setColumnValues((prevState) => ({...prevState, 'searchFor': e.target.value}))
                                        }}>
                                    <MenuItem className='fileSelectMenuItem' value="featureRequests">Feature Requests</MenuItem>
                                    <MenuItem className='fileSelectMenuItem' value="bugReports" disabled>Bug Reports (Coming Soon)</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {Object.values(columnValues).every(Boolean) &&
                        <>
                        <div style={{height: "20px"}}/>
                        <div className='fileSubmitWrapper'>
                            <button className='fileSubmit'>Upload</button>
                        </div>
                        </>
                    }
                    </>
                    }
            </Form>
            <div className="uploadedFilesWrapper">
                <p className='datasetsLabelText'>Processed Datasets</p>
                {processedDatasets && processedDatasets.map((row, idx) => (
                    <DatasetRow 
                        idx={idx} row={row} key={idx}
                        lastMessage={lastMessage}
                        deleteFetcher={deleteFetcher}
                        activelyDeletingFile={activelyDeletingFile}
                        setActivelyDeletingFile={setActivelyDeletingFile}
                    />
                ))

                }
            </div>
        </>
    )
}