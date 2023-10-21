import Checkbox from '@mui/material/Checkbox';

export default function GeneralDataset(props){

    function handleClick(){
        props.selectedDatasets.some(o => props.uniqueFileName === o) 
        ? props.setSelectedDatasets(props.selectedDatasets.filter(o => props.uniqueFileName !== o))
        : props.setSelectedDatasets([...props.selectedDatasets, props.uniqueFileName])
    }

    return (
        <div className='exampleDatasetMainContainer' onClick={handleClick} style={{
            border: props.selected ? "2px solid #b9c7c0" : "none"
        }}>
            <p className='exampleDatasetContainerTitle' style={{paddingLeft: "20px", paddingRight: "20px"}}>
                <span className="exampleDatasetContainerTitleIcon">
                </span>
                {props.title}
            </p>   
        </div>   
)}