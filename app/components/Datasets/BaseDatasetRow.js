import { rgba } from "@react-spring/shared";
import { BsFileArrowUp} from "react-icons/bs";
import { BsX } from "react-icons/bs";


export default function BaseDatasetRow(props){

    function handleDelete(){

    }

    function handleEnter(){
        if(props.row?.datasets){
            props.setHighlightedProcessedDatasets(props.row.datasets.map(i => i.datasetId))
        }
    }

    function handleLeave(){
        props.setHighlightedProcessedDatasets([])
    }

    return(
        <div 
             className='fileOuterWrapper' 
             onClick={() => props.handleUnprocessedDatasetClick(props.row.uniqueFileName, props.row.baseDatasetId)}
             onMouseEnter={handleEnter}
             onMouseLeave={handleLeave}
             >
            <div 
                className='fileCardBookmark' 
                style={{backgroundColor: props.unprocessedFileName === props.row.uniqueFileName ? "rgba(119, 153, 141, 0.5)" : "rgba(75, 85, 99, 0.3)"}}/>
            <div className='fileInnerWrapper'>
                <div className='fileTitleRow'>
                    <div className='fileTitleWrapper'>
                        <p className='fileTitle'>{props.row.uniqueFileName.split("-").slice(2).join("-") || `Untitled (${props.idx})`}</p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='fileRemoveWrapper'>
                        <BsX 
                            onClick={handleDelete}
                            style={{fontSize: "28px", color: "#9CA3AF", cursor: "pointer"}}/>
                    </div>
                </div>
                {/* <div>
                    <p className='fileCardStatus' style={{color: "rgba(75, 85, 99, 0.3)"}}>.csv</p>
                </div> */}
                <div className='fileMetadataRow'>
                    <div className='fileMetadataWrapper'>
                        <p className='fileMetadata'>Uploaded by {props.row.originUser ? `@${props.row.originUser}` : 'an unknown user'} from {props.row.origin ? {'discord': "Discord", "fileUpload": "a csv file"}[props.row.origin] : "an unknown platform"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}