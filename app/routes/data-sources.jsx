import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets } from '~/models/dataset-upload.server';
import { authenticator } from "~/models/auth.server.js";
import { usePapaParse } from 'react-papaparse';

import useWebSocket, { ReadyState } from "react-use-websocket";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DatasetRow from "~/components/Datasets/DatasetRow"

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

    console.log("USER:", user)

    const formData = await unstable_parseMultipartFormData(request, googleUploadHandler,);
    const outputData = formData.get('upload');
    const jsonData = JSON.parse(outputData)
    console.log("JSON DATA:", jsonData)

    if(jsonData.completed){
        const datasetObj = await createDatasetObject(jsonData.uniqueFileName, user.id)
        const response = await initiateDatasetProcessing(datasetObj.uniqueFileName, datasetObj.datasetId, user.id)
        console.log("RESPONSE", response)
        return jsonData;
    }
    return { outputData }
}
  
export default function DataSources(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const deleteFetcher = useFetcher();

    const [fileRef, setFileRef] = useState(Date.now())
    const [submitIsOpen, setSubmitIsOpen] = useState(false)
    const [fileError, setFileError] = useState("")
    const [socketUrl, setSocketUrl] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    const { readString } = usePapaParse();

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

    useEffect(() => {
        if (lastMessage !== null) {
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
      }, [lastMessage, setMessageHistory]);

      useEffect(()=>{
        console.log("Connection Status", connectionStatus)
    }, [connectionStatus, messageHistory])

    useEffect(()=>{
        console.log("Last Message:", lastMessage)
    }, [lastMessage])


    const [columnDefs, setColumnDefs] = useState([
        {field: "Dataset"},
        {field: "Size"},
        {field: "Status"},
        {field: "Controls"}
    ])

    const handleFileChange = (e) => {
        setFileError("")
        setSubmitIsOpen(false)
        const file = e?.target?.files[0]
        
        if(file && file.type === 'text/csv'){
            readString(file, {
                preview: 1,
                complete: function (results) {
                    console.log("HI!")
                    console.log(results.data)
                    if(['text', 'author', 'id', 'created_at'].every(i => results.data[0].includes(i))){
                        setSubmitIsOpen(true)
                    }
                    else{
                        setFileError("The dataset should contain the fields 'text', 'author', 'id' and 'created at' If it doesn't, it might not have been generated correctly.")
                    }
                },
                error: function(error){
                    console.log("FILE CHANGE ERROR:", error)
                }
            })
            console.log("FILE!!!")
        }
        else{
            setFileError("The dataset has to be a csv, sorry!")
        }
    }

    const resetFile = () => {
        setFileError("")
        setSubmitIsOpen(false)
        setFileRef(Date.now())
    }

    return(
        <>
        <Header />
        <div className='dataTableOuterWrapper'>

            <div className='dataTableInnerWrapper'>
                <TableContainer component={Paper} >
                    <Table sx={{ width: "100%", minWidth: "100%", border: "2px solid black" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columnDefs.map((column, idx) => (
                                    <TableCell key={idx} align="left">{column.field}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {loaderData.datasets.map((row, idx) => (
                            <DatasetRow 
                                idx={idx} row={row} key={idx}
                                lastMessage={lastMessage}
                                deleteFetcher={deleteFetcher}
                                />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className='fileUploadWrapper'>
                <Form method="post" encType="multipart/form-data">
                    <input type="file" name="upload" onChange={handleFileChange} key={fileRef}/>
                    {setSubmitIsOpen && <button>upload</button>}
                </Form>
                </div>
                {fileError && <p>{fileError}</p>}
                <button onClick={resetFile}>Remove File</button>
            </div>
        </div>
        </>
    )
}

