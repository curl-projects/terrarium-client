import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets } from '~/models/dataset-upload.server';
import { authenticator } from "~/models/auth.server.js";
import { usePapaParse } from 'react-papaparse';

import useWebSocket, { ReadyState } from "react-use-websocket";
import DatasetRow from "~/components/Datasets/DatasetRow";
import PageTitle from "~/components/Header/PageTitle.js"

import { BsUpload } from "react-icons/bs";
import { BsX } from "react-icons/bs";

import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Snackbar from '@mui/material/Snackbar';

import { BiMessageSquareDetail } from 'react-icons/bi'
import { BsPerson } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi"; 
import { BsHash } from "react-icons/bs";


export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const datasets = await getDatasets(user.id)

    return { datasets }
}

export async function action({request}){

    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    console.log('HELLO', JSON.stringify(request.headers))
    
    const formData = await request.formData();
    const fileData = formData.get('upload');
    const fileOutputData = await googleUploadHandler(fileData)
    console.log("OUTPUT:", fileOutputData)
    
    const headerMapping = formData.get('headerMappings');
    console.log("HEADER MAPPING:", JSON.parse(headerMapping))

    const jsonData = JSON.parse(fileOutputData)

    if(jsonData.completed){
        const datasetObj = await createDatasetObject(jsonData.uniqueFileName, user.id, JSON.parse(headerMapping))
        const response = await initiateDatasetProcessing(datasetObj.uniqueFileName, datasetObj.datasetId, user.id, headerMapping)
        console.log("RESPONSE", response)
        return { jsonData: jsonData, response: response.status};
    }
    return { jsonData: jsonData }
}

export default function DataSources(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const deleteFetcher = useFetcher();

    const [fileRef, setFileRef] = useState(Date.now())
    const [fileFormIsOpen, setFileFormIsOpen] = useState(false)
    const [fileHeaders, setFileHeaders] = useState([])
    const [file, setFile] = useState();
    const [fileError, setFileError] = useState("")
    const [fileWarning, setFileWarning] = useState("")
    const [socketUrl, setSocketUrl] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);
    const [activelyDeletingFile, setActivelyDeletingFile] = useState("")

    const [columnValues, setColumnValues] = useState({'text': "",'author': "", "created_at": "", "id": "", "searchFor": ""})

    const { readString, jsonToCSV } = usePapaParse();

    useEffect(()=>{
        setSocketUrl(window.ENV.WEBSOCKETS_URL)
      }, [])

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(()=>{
        console.log("ACTION DATA:", actionData)
    }, [actionData])
    useEffect(() => {
        if (lastMessage !== null) {
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
      }, [lastMessage, setMessageHistory]);

      useEffect(()=>{
        console.log("Connection Status", connectionStatus)
    }, [connectionStatus, messageHistory])

    useEffect(()=>{
        console.log("HEADERS:", fileHeaders)
    }, [fileHeaders])

    const handleFileChange = (e) => {
        setFileWarning("")
        setFileError("")
        setFileFormIsOpen(false)
        const file = e?.target?.files[0]

        setFile(file)
        
        if(file && file.type === 'text/csv'){
            readString(file, {
                preview: 1,
                complete: function (results) {

                    console.log(results.data[0])
                    setFileHeaders(results.data[0])
                    setFileFormIsOpen(true)

                    for(let header of results.data[0]){
                        if((header.charAt(0) === "[" && header.charAt(-1) === "]") 
                          || (/^\d+$/.test(header))
                        ){ setFileWarning("It seems like these values might not be headers. Make sure your file has appropriate headers for each column.") } 
                    }
                },
                error: function(error){
                    console.log("FILE CHANGE ERROR:", error)
                }
            })
            console.log("FILE!!!")
        }
        else{
            setFileError("Input datasets can only be csv files for now")
        }
    }

    const resetFile = () => {
        setFile("")
        setFileError("")
        setFileHeaders([])
        setFileWarning("")
        setFileFormIsOpen(false)
        setFileRef(Date.now())
    }

    useEffect(()=>{
        if(actionData?.jsonData?.fileName){
            resetFile()
        }
    }, [actionData])

    useEffect(()=>{
        console.log("COLUMN VALUES:", columnValues)
    }, [columnValues])

    return(
        <>
        <Header />
        <div className='dataTableOuterWrapper'>
        <PageTitle title="Data Sources" padding={true} description="Upload datasets for analysis and visualisation."/>
                <Form method="post" encType="multipart/form-data" className='fileUploadRectangle'>
                    <BsUpload style={{fontSize: "30px"}}/>
                    {file 
                    ? <p className='fileUploadText'>{file.name}</p>
                    :
                    <>
                        <label htmlFor='datasetFiles' className='fileUploadText' style={{cursor: 'pointer'}}>Choose file to upload</label>
                    </>
                    }
                    <input type='hidden' name='headerMappings' value={JSON.stringify(columnValues)}/>
                    <input id='datasetFiles' style={{display: "none"}} type="file" name="upload" onChange={handleFileChange} key={fileRef}/>
                    {!file && <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>(csv files generated from discord)</p>}
                    {file && <p className='fileUploadSpecifier' onClick={resetFile} style={{color: "rgba(75, 85, 99, 0.8)", cursor: "pointer"}}>Remove File</p>}
                    
                    {fileError && <p className='fileUploadSpecifier' style={{color: "rgba(146, 0, 0, 0.7)"}}>{fileError}</p>}
                {file && fileFormIsOpen && 
                    <>
                    <div className='fileOptionSeparator'/>
                    <div className='fileOptionWrapper'>
                    {!(fileHeaders.length === 0) && <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>Found headers: {fileHeaders.join(", ")}</p>}
                    {fileWarning && <p className='fileUploadSpecifier' style={{color: "#7E998E"}}>{fileWarning}</p>}
                        {[{name: 'text', icon: <BiMessageSquareDetail />}, 
                          {name: 'author', icon: <BsPerson />}, 
                          {name: 'id', icon: <BsHash />}, 
                          {name: 'created_at', icon: <BiCalendar />}].map((field, idx) => 
                            <div className='fileOptionRow' key={idx}>
                                <div className='fileOptionLabel'>
                                    {/* <div className='fileOptionIconWrapper'>
                                        {/* {field.icon && field.icon} */}
                                    {/* </div> */}
                                    <p className='fileOptionLabelText'>{field.name}</p>
                                </div>
                                <div className='fileOptionInputWrapper'>
                                    <Select 
                                        className='fileOptionInputSelect'
                                        onChange={function(e){
                                            setColumnValues((prevState) => ({...prevState, [field.name]: e.target.value}))
                                        }}
                                    >
                                        {fileHeaders && fileHeaders.map((column, idx) => 
                                            <MenuItem className='fileSelectMenuItem' value={column}>{column}</MenuItem>
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
                                    onChange={function(e){
                                            setColumnValues((prevState) => ({...prevState, 'searchFor': e.target.value}))
                                        }}>
                                    <MenuItem className='fileSelectMenuItem' value="featureRequests">Feature Requests</MenuItem>
                                    <MenuItem className='fileSelectMenuItem' value="bugReports">Bug Reports</MenuItem>
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
                    <p className='datasetsLabelText'>Datasets</p>
                    {loaderData.datasets.map((row, idx) => (
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
        </div>
        <Snackbar  
            open={actionData?.response === "404"}
            autoHideDuration={4000}
            message="Error Contacting Server"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}

        />
        </>
    )
}

