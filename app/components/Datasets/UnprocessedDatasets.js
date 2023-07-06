import { useEffect, useState } from 'react';
import { BsUpload } from "react-icons/bs";
import { Form, useFetcher } from "@remix-run/react";
import { usePapaParse } from 'react-papaparse';
import BaseDatasetRow from "~/components/Datasets/BaseDatasetRow";
import { Tooltip } from '@mui/material';

export default function UnprocessedDatasets(props){
    const [fileRef, setFileRef] = useState(Date.now())
    const [file, setFile] = useState("")
    const [fileHeaders, setFileHeaders] = useState([])
    const [fileWarning, setFileWarning] = useState("")
    const [fileError, setFileError] = useState("")
    const [nameArray, setNameArray] = useState([])

    const { readString } = usePapaParse();

    const handleFileChange = (e) => {
        const fileData = e?.target?.files[0]

        console.log("FILEDATA:", fileData)

        setFile(fileData)

        if(fileData && fileData.type === 'text/csv'){
            readString(fileData, {
                preview: 1,
                complete: function (results) {
                    setFileHeaders(results.data[0].filter(Boolean))

                    for(let header of results.data[0]){
                        if((header.charAt(0) === "[" && header.charAt(-1) === "]") 
                          || (/^\d+$/.test(header))
                        ){ setFileWarning("It seems like these values might not be headers. Make sure your file has appropriate headers for each column.") } 
                    }
                },
                error: function(error){
                    console.log("FILE CHANGE ERROR:", error)
                }
            })
        }
        else{
            setFileError("Input datasets can only be csv files for now")
        }
    }

    const resetFile = () => {
        setFile("")
        setFileRef(Date.now())
        setFileWarning("")
        setFileError("")
        setFileHeaders([])
    }

    function alterDuplicates(nameArray){
        var map = {};
        var count = nameArray.map(function(val) {
            return map[val] = (typeof map[val] === "undefined") ? 1 : map[val] + 1;
        });

        var newArray = nameArray.map(function(val, index) {
            if (map[val] === 1) {
                return val;
            } else {
                return val + " (" + count[index] + ")";
            }
        });
    
    return newArray
    }

    useEffect(()=>{
        const nameArray = props.baseDatasets.map(i => i.uniqueFileName.split("-").slice(1).join("-"))
        const outputArray = alterDuplicates(nameArray)

        setNameArray(outputArray)

    }, [props.baseDatasets])

    return(
        <>
        <div className="uploadedFilesWrapper">
            {props.baseDatasets.map((row, idx) => (
                <BaseDatasetRow 
                    idx={idx} row={row} key={idx}
                    name={nameArray.length > idx ? nameArray[idx] : ""}
                    handleUnprocessedDatasetClick={props.placeholder ? {} : props.handleUnprocessedDatasetClick}
                    unprocessedFileName={props.unprocessedFileName}
                    setHighlightedProcessedDatasets={props.setHighlightedProcessedDatasets}
                    placeholder={props.placeholder}
                />
            ))
            }

        <Form method="post" encType="multipart/form-data" className='fileUploadRectangle'>
            <input type="hidden" name='actionType' value="unprocessedDataset"/>
            {/* <BsUpload style={{fontSize: "20px", color: "#4b5563"}}/> */}
            {file 
            ? <p className='fileUploadInitialText'>{file.name}</p>
            :
            <>
                {props.placeholder
                ? <Tooltip title='Any csv file should work, and file upload is also integrated with Discord!' placement='top' arrow><p className='fileUploadInitialText' style={{cursor: 'pointer'}}>Upload new file</p></Tooltip>
                : <label htmlFor='datasetFiles' className='fileUploadInitialText' style={{cursor: 'pointer'}}>Upload new file</label>
                }
            </>
            }
            <input id='datasetFiles' style={{display: "none"}} type="file" name="upload" onChange={handleFileChange} key={fileRef}/>
            {!(fileHeaders.length === 0) && <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>Found headers: {fileHeaders.join(", ")}</p>}
            {!file && <p className='fileUploadSpecifier' style={{color: "rgba(75, 85, 99, 0.4)"}}>Accepts csv files with headers</p>}
            {file && <p className='fileUploadSpecifier' onClick={resetFile} style={{color: "rgba(75, 85, 99, 0.8)", cursor: "pointer"}}>Remove File</p>}
            
            {fileError && <p className='fileUploadSpecifier' style={{color: "rgba(146, 0, 0, 0.7)"}}>{fileError}</p>}

            {!fileError && fileWarning && <p className='fileUploadSpecifier' style={{color: "#7E998E", marginTop: "2px", marginBottom: "2px"}}>{fileWarning}</p>}
            {(file && !fileError) &&
                <>
                <div style={{height: "20px"}}/>
                <div className='fileSubmitWrapper'>
                    {!props.placeholder && <button className='fileSubmit' style={{border: "unset", fontSize: '16px', transition: "all 0.2s ease-in-out"}}>Upload</button>}
                </div>
                </>
            }
            </Form>
        </div>
        </>

    )
}