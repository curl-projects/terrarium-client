import { BsFileArrowUp} from "react-icons/bs";
import { BsX } from "react-icons/bs";


export default function BaseDatasetRow(props){

    function handleDelete(){

    }

    return(
        <div className='fileOuterWrapper' onClick={() => props.handleUnprocessedDatasetClick(props.row.uniqueFileName, props.row.baseDatasetId)}>
            {/* <div className='fileIconWrapper'>
                        <BsFileArrowUp style={{fontSize: "26px", color: "rgba(75, 85, 99, 0.85)"}}/>
            </div> */}
            <div className='fileInnerWrapper'>
                <div className='fileTitleRow'>
                    <div className='fileTitleWrapper'>
                        <p className='fileTitle'>{props.row.uniqueFileName || `Untitled (${props.idx})`}</p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='fileRemoveWrapper'>
                        <BsX 
                            onClick={handleDelete}
                            style={{fontSize: "28px", color: "rgba(75, 85, 99, 0.95)", cursor: "pointer"}}/>
                    </div>
                </div>
                <div className='fileMetadataRow'>
                    <div className='fileMetadataWrapper'>
                        {/* <p className='fileMetadata'>{datasetSize ? String(datasetSize).concat(" Feature Requests") : "Unknown Size"}</p> */}
                        {/* <div className='fileMetadataDivider' /> */}
                        {/* <p className='fileMetadata'>{state.datasetStatus || ""}</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}