import Checkbox from '@mui/material/Checkbox';
import { useFetcher } from '@remix-run/react';


export default function ExampleDataset({ fetcher, ...props}){
    function handleClick(){
        if(props.active){
            fetcher.submit({
                actionType: "disconnectExampleDataset",
                datasetId: props.datasetId
            }, {method: "post"})

        }
        else{
            fetcher.submit({
                actionType: "addExampleDataset",
                datasetId: props.datasetId
            }, {method: "post"})     
        }
    }

    return (
        <div className='exampleDatasetMainContainer' onClick={handleClick} style={{
            border: props.active ? "2px solid #b9c7c0" : "1px solid #e7e7e7",
            backgroundColor: props.active ? "rgba(185, 199, 192, 0.3)" : "white",
        }}>
            <p className='exampleDatasetContainerTitle' style={{paddingLeft: "20px", paddingRight: "20px"}}>
                <span className="exampleDatasetContainerTitleIcon">
                </span>
                {props.title}
            </p>   
        </div>   
)}