import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets } from '~/models/dataset-upload.server';
import { authenticator } from "~/models/auth.server.js";
import { usePapaParse } from 'react-papaparse';

import useWebSocket, { ReadyState } from "react-use-websocket";
import DatasetRow from "~/components/Datasets/DatasetRow";

import { BsUpload } from "react-icons/bs";
import { BsX } from "react-icons/bs";

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
    const [file, setFile] = useState();
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
                        setFile(file)
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
        setFile("")
        setFileError("")
        setSubmitIsOpen(false)
        setFileRef(Date.now())
    }

    useEffect(()=>{
        console.log("FILE!", file)
    }, [file])

    return(
        <>
        <Header />
        <div className='dataTableOuterWrapper'>
                <Form method="post" encType="multipart/form-data" className='fileUploadRectangle'>
                    <BsUpload style={{fontSize: "30px"}}/>
                    {file 
                    ? <p className='fileUploadText'>{file.name}</p>
                    :
                    <>
                        <label htmlFor='datasetFiles' className='fileUploadText' style={{cursor: 'pointer'}}>Choose file to upload</label>
                    </>
                    }
                    <input id='datasetFiles' style={{display: "none"}} type="file" name="upload" onChange={handleFileChange} key={fileRef}/>
                    {fileError 
                    ? <p className='fileUploadSpecifier' style={{color: "rgba(146, 0, 0, 0.7)"}}>{fileError}</p>
                    : (file && submitIsOpen 
                        ? <p className='fileUploadSpecifier' 
                             onClick={resetFile} 
                             style={{color: "rgba(75, 85, 99, 0.8)", cursor: "pointer"}}>Remove File</p>
                        : <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>(csv files generated from discord)</p>
                        )}
                {file && submitIsOpen && 
                    <>
                    <div style={{height: "20px"}}/>
                    <div className='fileSubmitWrapper'>
                        <button className='fileSubmit'>Upload</button>
                    </div>
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
                        />
                    ))

                    }
                </div>

        </div>
        </>
    )
}

