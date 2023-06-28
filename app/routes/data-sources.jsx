import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useFetcher } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets, getBaseDatasets, createBaseDataset } from '~/models/dataset-upload.server';
import { authenticator } from "~/models/auth.server.js";
import { usePapaParse } from 'react-papaparse';

import PageTitle from "~/components/Header/PageTitle.js"

import Snackbar from '@mui/material/Snackbar';

import { BiMessageSquareDetail } from 'react-icons/bi'
import { BsPerson } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi"; 
import { BsHash } from "react-icons/bs";
import UnprocessedDatasets from '~/components/Datasets/UnprocessedDatasets';
import ProcessedDatasets from '~/components/Datasets/ProcessedDatasets';



export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const baseDatasets = await getBaseDatasets(user.id)
    const datasets = await getDatasets(user.id)

    return { datasets: datasets, baseDatasets: baseDatasets }
}

export async function action({request}){

    const user = await authenticator.isAuthenticated(request, { failureRedirect: "/" })
    const formData = await request.formData();    
    const actionType = formData.get('actionType')
    const updateExistingDataset = formData.get("updateExistingDataset")

    if(updateExistingDataset === 'true'){
        const headerMapping = formData.get('headerMappings');
        const datasetId = formData.get("datasetId")
        const datasetUniqueFileName = formData.get("datasetUniqueFileName")
        const baseDatasetUniqueFileName = formData.get("baseDatasetUniqueFileName")
        const response = await initiateDatasetProcessing(datasetUniqueFileName, baseDatasetUniqueFileName, datasetId, user.id, headerMapping)

        return { response: response.status, fileName: datasetUniqueFileName }
    }

    else if(actionType === 'unprocessedDataset'){
        const fileData = formData.get('upload');
        const fileOutputData = await googleUploadHandler(fileData);
        const jsonData = JSON.parse(fileOutputData)
        const baseDataset = await createBaseDataset(user.id, jsonData.uniqueFileName, "fileUpload")
        return { baseDataset }
    }
    else if(actionType === 'processedDataset'){
        const headerMapping = formData.get('headerMappings');
        const uniqueFileName = formData.get("uniqueFileName");
        const baseDatasetId = formData.get("baseDatasetId")

        const datasetObj = await createDatasetObject(uniqueFileName, user.id, JSON.parse(headerMapping), baseDatasetId)
        console.log("DATATEST OBJ:", datasetObj)
        const response = await initiateDatasetProcessing(datasetObj.uniqueFileName, uniqueFileName, datasetObj.datasetId, user.id, headerMapping)
        return { datasetObj, response: response.status, fileName: datasetObj.uniqueFileName }
    }

    else{
        console.error("Unknown Action Type")
        return "Unknown Action Type"
    }
    // const fileData = formData.get('upload');
    // const fileOutputData = await googleUploadHandler(fileData)
    // console.log("OUTPUT:", fileOutputData)
    
    const headerMapping = formData.get('headerMappings');
    // console.log("HEADER MAPPING:", JSON.parse(headerMapping))

    // const jsonData = JSON.parse(fileOutputData)

    // if(jsonData.completed){
    //     const datasetObj = await createDatasetObject(jsonData.uniqueFileName, user.id, JSON.parse(headerMapping))
    //     const response = await initiateDatasetProcessing(datasetObj.uniqueFileName, datasetObj.datasetId, user.id, headerMapping)
    //     console.log("RESPONSE", response)
    //     return { jsonData: jsonData, response: response.status};
    // }
    // return { jsonData: jsonData }
}

export default function DataSources(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const readDatasetFetcher = useFetcher();

    const [baseDatasetId, setBaseDatasetId] = useState("")
    const [activelyDeletingFile, setActivelyDeletingFile] = useState("")
    const [unprocessedFileName, setUnprocessedFileName] = useState("")
    const [fileHeaders, setFileHeaders] = useState([])
    const [highlightedProcessedDatasets, setHighlightedProcessedDatasets] = useState('default')

    useEffect(()=>{
        console.debug('LOADER DATA:', loaderData)
    }, [loaderData])

    // READING UNPROCESSED DATASETS
    function handleUnprocessedDatasetClick(fileName, baseDatasetId){
        setFileHeaders([])
        setUnprocessedFileName(fileName)
        setBaseDatasetId(baseDatasetId)
        readDatasetFetcher.submit({fileName: fileName}, {'method': 'get', 'action': "utils/read-dataset"})
    }

    return(
        <div className='pageWrapper'>
        <Header />
        <div className='dataTableOuterWrapper'>
        <PageTitle title="Data Sources" padding={true} description="Upload datasets for analysis and visualisation."/>
        <div className='dataSourcesInnerSplitter'>
            <div className='dataSourcesInnerContainer'>
                <div className='unprocessedDataWrapper'>
                    <UnprocessedDatasets 
                        baseDatasets={loaderData.baseDatasets}
                        handleUnprocessedDatasetClick={handleUnprocessedDatasetClick}
                        unprocessedFileName={unprocessedFileName}
                        setHighlightedProcessedDatasets={setHighlightedProcessedDatasets}
                        />
                </div>
                <div className='processedDataWrapper'>
                    <ProcessedDatasets 
                        processedDatasets={loaderData.datasets}
                        activelyDeletingFile={activelyDeletingFile}
                        setActivelyDeletingFile={setActivelyDeletingFile}
                        readDatasetFetcher={readDatasetFetcher}
                        unprocessedFileName={unprocessedFileName}
                        setUnprocessedFileName={setUnprocessedFileName}
                        baseDatasetId={baseDatasetId}
                        setBaseDatasetId={setBaseDatasetId}
                        fileHeaders={fileHeaders}
                        setFileHeaders={setFileHeaders}
                        highlightedProcessedDatasets={highlightedProcessedDatasets}
                        actionData={actionData}
                        handleUnprocessedDatasetClick={handleUnprocessedDatasetClick}
                    />
                </div>
            </div>
        </div>
                
        </div>
        <Snackbar  
            open={actionData?.response === "404"}
            autoHideDuration={4000}
            message="Error Contacting Server"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}

        />
        </div>
    )
}

