import { rgba } from "@react-spring/shared";
import { BsFileArrowUp} from "react-icons/bs";
import { BsX } from "react-icons/bs";
import { useFetcher } from "@remix-run/react"
import { BiCog } from "react-icons/bi"
import Tooltip from '@mui/material/Tooltip';

export default function BaseDatasetRow(props){
    const deleteFetcher = useFetcher()

    function handleDelete(){
        deleteFetcher.submit({baseDatasetId: props.row.baseDatasetId, 
                                    datasets: JSON.stringify(props.row.datasets), uniqueFileName: props.row.uniqueFileName}, 
            {method: "post", action: "/utils/delete-base-dataset"})
    }

    function handleEnter(){
        props.setHighlightedProcessedDatasets(props.row.datasets.map(i => i.datasetId))
    }

    function handleLeave(){
        props.setHighlightedProcessedDatasets('default')
    }

    return(
        <div 
             className='fileOuterWrapper' 
             onMouseEnter={handleEnter}
             onMouseLeave={handleLeave}
             onClick={(e) => {e.stopPropagation(), props.handleUnprocessedDatasetClick(props.row.uniqueFileName, props.row.baseDatasetId)}}
             >
            <div 
                className='fileCardBookmark' 
                style={{backgroundColor: props.unprocessedFileName === props.row.uniqueFileName ? "rgba(119, 153, 141, 0.5)" : "rgba(75, 85, 99, 0.3)"}}/>
            <div className='fileInnerWrapper'>
                <div className='fileTitleRow'>
                    <div className='fileTitleWrapper'>
                        <p className='fileTitle'>{props.name || props.row.uniqueFileName.split("-").slice(1).join("-")}</p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='fileRemoveWrapper'>
                        <Tooltip title="Process Dataset" placement='top' arrow>
                            <div>
                                <BiCog 
                                    onClick={() => props.handleUnprocessedDatasetClick(props.row.uniqueFileName, props.row.baseDatasetId)}
                                    style={{fontSize: "20px", color: "#9CA3AF", cursor: "pointer"}}
                                />
                            </div>
                        </Tooltip>
                        <Tooltip title="Delete Dataset" placement='top' arrow>
                            <div>
                            <BsX 
                                onClick={handleDelete}
                                style={{fontSize: "28px", color: "#9CA3AF", cursor: "pointer"}}/>
                            </div>
                        </Tooltip>
                    </div>
                </div>
                {/* <div>
                    <p className='fileCardStatus' style={{color: "rgba(75, 85, 99, 0.3)"}}>.csv</p>
                </div> */}
                <div className='fileMetadataRow'>
                    <div className='fileMetadataWrapper'>
                        {(deleteFetcher.state === 'submitting' || deleteFetcher.state === 'loading')
                        ? <p className='fileMetadata'>Dataset Deleting...</p>
                        : <p className='fileMetadata'>Uploaded by {props.row.originUser ? `@${props.row.originUser}` : 'an unknown user'} from {props.row.origin ? {'discord': "Discord", "fileUpload": "a csv file"}[props.row.origin] : "an unknown platform"}</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}