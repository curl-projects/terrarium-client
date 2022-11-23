import React from 'react'
import RichTextEditor from '~/components/LeoEditor/RichTextEditor'
import {json,} from "@remix-run/node"
import {useLoaderData} from "@remix-run/react"
import {db} from "../../models/db.server"
import { TextBox } from '@prisma/client'

export const loader = async () => {
    const data = await db.textBox.findUnique({where: {id: 1}})
    return json(data)
}

const Demo = () => {
    const data = useLoaderData()
    return (
        <div style={{ margin: 50, border: "1px solid black" }}>
            <RichTextEditor />
        </div>
    )
}

export default Demo
