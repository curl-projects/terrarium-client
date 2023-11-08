import Checkbox from '@mui/material/Checkbox';
import { useFetcher } from '@remix-run/react';


export default function LargeExampleDataset({ fetcher, ...props}){
    function handleClick(){
        if(props.datasourced){
            if(props.active){
                props.setActiveExampleDataset({status: "removing", readableName: props.readableName})
                fetcher.submit({
                    actionType: "disconnectExampleDataset",
                    datasetId: props.datasetId,
                }, {method: "post"})
    
            }
            else{
                props.setActiveExampleDataset({status: "adding", readableName: props.readableName})
                fetcher.submit({
                    actionType: "addExampleDataset",
                    datasetId: props.datasetId,
                }, {method: "post"})     
            }
        }
        else{
            if (props.selectedDatasets.includes(props.uniqueFileName)) {
                // Remove the item if it exists in the array
                props.setSelectedDatasets(props.selectedDatasets.filter((i) => i !== props.uniqueFileName));
              } else {
                // Add the item to the array if it doesn't exist
                props.setSelectedDatasets([...props.selectedDatasets, props.uniqueFileName]);
              }           
        }
    }


    return (
        <div className='exampleDatasetMainContainer' onClick={handleClick} style={{
            border: props.active ? "2px solid #b9c7c0" : "1px solid #e7e7e7",
            backgroundColor: props.active ? "rgba(185, 199, 192, 0.3)" : "white",
            flexDirection: 'column',
            height: "fit-content",
            padding: "20px",
            maxWidth: "400px",
            textAlign: "center",
        }}>
            <p className='exampleDatasetContainerTitle' style={{paddingLeft: "20px", paddingRight: "20px", fontWeight: "700", fontSize: "20px"}}>
                <span className="exampleDatasetContainerTitleIcon">
                </span>
                {props.title}
            </p>
            <p className='exampleDatasetContainerDescription'>{props.description || "No Description"}</p>   
        </div>   
)}