import { useState, useMemo, useRef, useCallback } from 'react';
import Header from "~/components/Header/Header"
import { AgGridReact } from "ag-grid-react";

export default function DataSources(){
    const gridRef = useRef([]);
    const [rowData, setRowData] = useState([{"make": 'Toyota', "model": "v5", 'price': "a lot"}])    
    const [columnDefs, setColumnDefs] = useState([
        {field: "make", filter: true},
        {field: "model", filter: true},
        {field: "price", filter: true},
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
        <div style={{width: "80%", height: "800px", marginTop: "100px", border:"2px solid pink"}}>
            <div className="ag-theme-alpine" style={{height: "100%", width: "100%"}}>
                <AgGridReact 
                    ref={gridRef} 
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onCellClicked={cellClickedListener}
                    animateRows={true}
                    />
            </div>
        </div>
        </>
    )
}