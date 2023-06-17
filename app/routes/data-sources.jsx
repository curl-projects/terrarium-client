import { useState, useMemo, useRef, useCallback } from 'react';
import { unstable_parseMultipartFormData, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import Header from "~/components/Header/Header"
import { googleUploadHandler, createDatasetObject, initiateDatasetProcessing, getDatasets } from '~/models/dataset-upload.server';
import { useEffect } from 'react';
import { authenticator } from "~/models/auth.server.js";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import DatasetRow from "~/components/Datasets/DatasetRow"
export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const datasets = await getDatasets(user.id)

    return { datasets }
}

export async function action({request}){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const formData = await unstable_parseMultipartFormData(request, googleUploadHandler,);
    const outputData = formData.get('upload');
    // const jsonData = JSON.parse(outputData)
    // if(jsonData.completed){
    //     const datasetObj = await createDatasetObject(jsonData.uniqueFileName, user.id)
    //     const response = await initiateDatasetProcessing(datasetObj.uniqueFileName)
        // return jsonData;
    // }
    return { outputData }
}
  
export default function DataSources(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    useEffect(()=>{
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])

    useEffect(()=>{
        console.log("ACTION DATA:", actionData)
    }, [actionData])


    const gridRef = useRef([]);
    const [rowData, setRowData] = useState([{"make": 'Toyota', "model": "v5", 'price': "a lot"}])    
    const [columnDefs, setColumnDefs] = useState([
        {field: "Dataset"},
        {field: "Size"},
        {field: "Status"},
    ])

    const defaultColDef = useMemo( ()=> ({
        sortable: true
      }));
   
    const cellClickedListener= useCallback( e => {
        console.log("Cell Clicked", e)
    })

    return(
        <>
        <Header />
        <div className='dataTableOuterWrapper'>

            <div className='dataTableInnerWrapper'>
                <TableContainer component={Paper} >
                    <Table sx={{ width: "100%", minWidth: "100%", border: "2px solid black" }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {columnDefs.map((column, idx) => (
                                    <TableCell key={idx} align="left">{column.field}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {loaderData.datasets.map((row, idx) => (
                            <DatasetRow idx={idx} row={row} key={idx} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className='fileUploadWrapper'>
                <Form method="post" encType="multipart/form-data">
                    <input type="file" name="upload" />
                    <button>upload</button>
                </Form>
                </div>
            </div>
        </div>
        </>
    )
}


// const bucketName = "terrarium-fr-datasets";

// const cloudStorage = new Storage({
//     projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
//     scopes: 'https://www.googleapis.com/auth/cloud-platform',
//     credentials: {
//         client_email: process.env.GOOGLE_STORAGE_EMAIL,
//         private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY
//     }
// });
// const cloudStorage = new Storage({
//     keyFilename: "terrarium-390113-2ac7824ead09.json"
// });