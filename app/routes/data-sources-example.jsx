import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, useFetcher, Link } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets, getBaseDatasets, createBaseDataset, getExampleDatasets, connectExampleDataset, disconnectExampleDataset } from '~/models/dataset-upload.server';
import { authenticator } from "~/models/auth.server.js";
import { usePapaParse } from 'react-papaparse';
import TextTransition, { presets } from 'react-text-transition';

import PageTitle from "~/components/Header/PageTitle.js"

import Snackbar from '@mui/material/Snackbar';

import { BiMessageSquareDetail } from 'react-icons/bi'
import { BsPerson } from "react-icons/bs"
import { BiCalendar } from "react-icons/bi"; 
import { BsHash } from "react-icons/bs";
import UnprocessedDatasets from '~/components/Datasets/UnprocessedDatasets';
import ProcessedDatasets from '~/components/Datasets/ProcessedDatasets';
import ExampleDataset from '~/components/Datasets/ExampleDataset';
import { getUserWithDatasets } from '~/models/dataset-manipulation.server';
import LargeExampleDataset from '~/components/Datasets/LargeExampleDataset';
import LinearProgress from '@mui/material/LinearProgress';
import { Fade } from "react-awesome-reveal";

export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const baseDatasets = await getBaseDatasets(user.id)
    const datasets = await getDatasets(user.id)
    const exampleDatasets = await getExampleDatasets(user.id)
    const dbUser = await getUserWithDatasets(user.id)

    return { datasets: datasets.map(e => e['dataset']), baseDatasets: baseDatasets, user: dbUser, exampleDatasets: exampleDatasets}
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
        const response = await initiateDatasetProcessing(datasetUniqueFileName, baseDatasetUniqueFileName, datasetId, user.id, headerMapping, true)

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
        const response = await initiateDatasetProcessing(datasetObj.uniqueFileName, uniqueFileName, datasetObj.datasetId, user.id, headerMapping, false)
        return { datasetObj, response: response.status, fileName: datasetObj.uniqueFileName }
    }

    else if(actionType === 'addExampleDataset'){
        const addedDataset = await connectExampleDataset(user.id, formData.get("datasetId"))
        return { addedDataset }
    }
    else if(actionType === 'disconnectExampleDataset'){
        const disconnectedDataset = await disconnectExampleDataset(user.id, formData.get("datasetId"));
        return { disconnectedDataset }
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

export default function DataSourcesExample(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const exampleDatasetFetcher = useFetcher();
    const readDatasetFetcher = useFetcher();

    const [baseDatasetId, setBaseDatasetId] = useState("")
    const [activelyDeletingFile, setActivelyDeletingFile] = useState("")
    const [unprocessedFileName, setUnprocessedFileName] = useState("")
    const [fileHeaders, setFileHeaders] = useState([])
    const [highlightedProcessedDatasets, setHighlightedProcessedDatasets] = useState('default')
    const platformValues = ["Anywhere", 'Discord', 'Slack', 'Telegram', 'CSV',]
    const [platformIndex, setPlatformIndex] = useState(0);
    const typeValues = ['Feature Requests', 'Issues', 'Bug Reports', "Ideas", "Anything"]
    const [typeIndex, setTypeIndex] = useState(0);


    useEffect(()=>{
        const intervalId = setInterval(
            () => {
                setTypeIndex((typeIndex) => typeIndex + 1)

                setPlatformIndex((platformIndex) => platformIndex + 1)
            },
            3000
        );

        return () => clearTimeout(intervalId)
    }, [])



    useEffect(()=>{
        console.log('LOADER DATA:', loaderData)
    }, [loaderData])

    // READING UNPROCESSED DATASETS
    function handleUnprocessedDatasetClick(fileName, baseDatasetId){
        setFileHeaders([])
        setUnprocessedFileName(fileName)
        setBaseDatasetId(baseDatasetId)
        readDatasetFetcher.submit({fileName: fileName}, {'method': 'get', 'action': "utils/read-dataset"})
    }

    return(
        <div className='dataSourcesPageWrapper'>
        <Header />
        {/* <PageTitle 
            title="Data Sources" 
            padding={true} 
            description="Upload datasets for analysis and visualisation."
            fetcher={exampleDatasetFetcher}
            /> */}
        
        <div className='pageTitleOuterWrapper' style={{
                    gridRow: "2 / 3",
                    gridColumn: "2 / 3",
                    paddingTop: "8%"
        }}>
        <Fade className='pageTitle' duration={1500} style={{textAlign: "center", display: 'flex', flexDirection: "column", alignItems: "center"}}>
]                <h1 className='landingPageTitleText' style={{letterSpacing: "-0.06em", color: "#4b5563"}}>
                    Add
                    <TextTransition
                    inline={true}
                    direction='down'
                    springConfig={presets.gentle} 
                    className='landingPageTitleChangingText'
                    style={{marginLeft: "10px", marginRight: "10px", color: "#B0BFB9"}}
                    >
                        {typeValues[typeIndex % typeValues.length]}
                    </TextTransition>
                    from 
                    <TextTransition
                    inline={true}
                    direction='up'
                    springConfig={presets.gentle} 
                    style={{marginLeft: "10px", marginRight: "10px"}}
                    className='landingPageTitleChangingText'
                    >
                        {platformValues[platformIndex % platformValues.length]}
                    </TextTransition>
                    ...
                </h1>
                <div className='pageTitleDivider' style={{width: "80%", marginTop: "10px"}}/>
                {exampleDatasetFetcher && (exampleDatasetFetcher.state === "submitting" || exampleDatasetFetcher.state === 'loading')  &&
                        <LinearProgress 
                            variant="indeterminate"
                            style={{width: "80%", 
                                    height: "2px", 
                                    backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                        />
                }
                <p className='featureSearchDescriptionText' style={{
                    paddingTop: '10px'
                }}>Click a dataset to add it to your workspace</p>
            </Fade>
        </div>
        <div className='dataSourcesInnerSplitter' style={{
            paddingTop: "20px"
        }}>
            <div className='dataSourcesExampleRow'>
                <Fade cascade direction='up' delay={1000}>
                    {loaderData.exampleDatasets.map((dataset, index)=>
                        
                            <LargeExampleDataset 
                                title={dataset.dataset.readableName}
                                key={dataset.datasetId}
                                datasetId={dataset.datasetId}
                                active={dataset.active}
                                fetcher={exampleDatasetFetcher}
                                description={dataset.description}
                                datasourced={true}
                                />
                    )}
                </Fade>
            </div>
            {/* <div className='dataSourcesInnerContainer'>
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
                        exampleDatasets={loaderData.exampleDatasets}
                    />
                </div>
            </div> */}
        </div>
        <Snackbar  
            open={actionData?.response === "404"}
            autoHideDuration={4000}
            message="Error Contacting Server"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}

        />
        {loaderData?.exampleDatasets.map(d => d.active).some(i => i) &&
        <div className='exampleDataSourcesNext'>
            <Fade direction='up'>
                <Link to={'/roadmap-example'}>
                <p className='exampleDataSourcesNextText'>Next →</p>
                </Link>
            </Fade>
        </div>
        }
        </div>
    )
}

