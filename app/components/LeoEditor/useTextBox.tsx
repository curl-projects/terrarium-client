import React, { useEffect, useState } from "react"
import {useFetcher} from "@remix-run/react"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { TextBox } from "@prisma/client"
import { ApiResponseDataType } from "../utils/apiResponse"

export const useTextBox = ({featureId}: {featureId: number}) => {

    const [editorState, setEditorState] = useState<EditorState | null>(null)

    const [loadRetries, setLoadRetries] = useState(0)
    const [actionRetries, setActionRetries] = useState(0)

    const dataFetcher = useFetcher()
    const updateFetcher = useFetcher()

    // go and get the data
    useEffect(() => {(async () => {
        await new Promise(r => setTimeout(r, loadRetries * 100))
        dataFetcher.submit(null,{method: "get", action: `api/textBox/${featureId}`})
    })()}, [loadRetries])

    // sync the local state to the received data
    useEffect(() => {
        if (dataFetcher.data) {
            if (dataFetcher.data.ok) {
                setLoadRetries(0)
                const textBox = (dataFetcher.data as (ApiResponseDataType<{textBox: TextBox}> | undefined))?.payload?.textBox
                if (textBox) {
                    const derivedEditorState = EditorState.createWithContent(
                        convertFromRaw(JSON.parse(textBox.serializedContent)))
                    setEditorState(derivedEditorState)
                }
            } else {
                setLoadRetries(r => r + 1)
            }
        }
    }, [dataFetcher.data])

    // update the server with new textbox state
    const serializedContent = editorState && JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    useEffect(() => {(async () => {
        console.log("SERIALIZED CONTENT:", serializedContent)
        if (serializedContent) {
            const formData = new FormData()
            formData.append("id", featureId.toString())
            formData.append("serializedContent", serializedContent)
            formData.append("updatedAt", Date.now().toString())
            updateFetcher.submit(formData, {method: "post", action: "api/textBox?index"})
        }
    })()}, [serializedContent, actionRetries])

    useEffect(() => {
        if (updateFetcher.data) {
            if (updateFetcher.data.ok) {
                setActionRetries(0)
            } else {
                // setActionRetries(r => r + 1)
            }
        }
    }, [updateFetcher.data])

    const loadErr = loadRetries > 0
    const actionErr = actionRetries > 0
    const syncState = (loadErr || actionErr)
        ? "error"
        : (!updateFetcher.state || updateFetcher.state == "idle")
            ? "idle"
            : "syncing"

    return {editorState, setEditorState, syncState: syncState as typeof syncState}
}
