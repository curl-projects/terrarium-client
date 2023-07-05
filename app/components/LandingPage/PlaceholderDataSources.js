import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import PlaceholderHeader from "~/components/LandingPage/PlaceholderHeader"

import PageTitle from "~/components/Header/PageTitle.js"

import Snackbar from '@mui/material/Snackbar';

import { BiMessageSquareDetail } from 'react-icons/bi'

import UnprocessedDatasets from '~/components/Datasets/UnprocessedDatasets';
import ProcessedDatasets from '~/components/Datasets/ProcessedDatasets';
import { useFetcher } from '@remix-run/react';

const dataObject = {
    baseDatasets: [
        {
            baseDatasetId: 7,
            origin: "fileUpload",
            originUser: null,
            uniqueFileName: "e2vd-heptabase-test.csv",
            userId: "110421822788553907926",
            datasets: [{
                datasetId: 67,
            }]
        }
    ],
    datasets: [
        {
        baseDataset: null,
        baseDatasetId: null,
        datasetId: 67,
        datasetMapping: null,
        size: "768",
        status: "dataset_generated",
        uniqueFileName: "v9i-heptabase-test.csv",
        userId: "111110003400"
        },
    ]
}

export default function PlaceholderDataSources(){
    const [baseDatasetId, setBaseDatasetId] = useState("")
    const [activelyDeletingFile, setActivelyDeletingFile] = useState("")
    const [unprocessedFileName, setUnprocessedFileName] = useState("")
    const [fileHeaders, setFileHeaders] = useState([])
    const [highlightedProcessedDatasets, setHighlightedProcessedDatasets] = useState('default')

    const readDatasetFetcher = useFetcher()

    // READING UNPROCESSED DATASETS
    function handleUnprocessedDatasetClick(fileName, baseDatasetId){
        setFileHeaders([])
        setUnprocessedFileName(fileName)
        setBaseDatasetId(baseDatasetId)
        // readDatasetFetcher.submit({fileName: fileName}, {'method': 'get', 'action': "utils/read-dataset"})
    }

    return(
        <div 
            style={{
                width: "125%", 
                height: "125%", 
                display: "grid", 
                gridTemplateColumns: "70px 1fr 70px", 
                gridTemplateRows: "100px min-content 1fr 70px",
                transform: "scale(0.8)",
                transformOrigin: "top left",
                }}>
        <PlaceholderHeader />
        <PageTitle title="Data Sources" placeholder={true} description="Upload datasets for analysis and visualisation."/>
        <div className='dataSourcesInnerSplitter' style={{flex: 1}}>
            <div className='dataSourcesInnerContainer'>
                <div className='unprocessedDataWrapper'>
                    <UnprocessedDatasets 
                        baseDatasets={dataObject.baseDatasets}
                        handleUnprocessedDatasetClick={handleUnprocessedDatasetClick}
                        unprocessedFileName={unprocessedFileName}
                        setHighlightedProcessedDatasets={setHighlightedProcessedDatasets}
                        placeholder={true}
                        />
                </div>
                <div className='processedDataWrapper'>
                    <ProcessedDatasets 
                        processedDatasets={dataObject.datasets}
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
                        handleUnprocessedDatasetClick={handleUnprocessedDatasetClick}
                        placeholder={true}
                    />
                </div>
            </div>
        </div>
        <Snackbar  
            autoHideDuration={4000}
            message="Error Contacting Server"
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}

        />
        </div>
    )
}

