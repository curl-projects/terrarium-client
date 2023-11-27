import { Select } from "@mui/material"
import { useLoaderData, useOutlet } from "@remix-run/react"
import { useState } from "react"

export default function Sandbox(){
    const [outlet] = useState(useOutlet())
    const data = useLoaderData() || {}

    return(
        <div style={{
            position: "absolute",
            left: '50%',
            top: '50%',
            height: '500px',
            width: '500px',
            border: '2px solid green',
            transform: "translate(-50%, -50%)"
        }}>
            <Select>
                
            </Select>

        </div>
    )
}