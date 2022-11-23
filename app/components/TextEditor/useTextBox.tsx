import React, { useEffect, useState } from "react"
import {useFetcher} from "@remix-run/react"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { TextBox } from "@prisma/client"
import { ApiResponseDataType } from "../utils/apiResponse"

export const useTextBox = ({featureId}: {featureId: number}) => {

    const [editorState, setEditorState] = useState<EditorState | null>(null)

    const dataFetcher = useFetcher()
    const updateFetcher = useFetcher()

    // go and get the data
    useEffect(() => {(async () => {
        dataFetcher.submit(null, {method: "get", action: `api/textBox/${featureId}`})
    })()}, [])

    // sync the local state to the received data
    useEffect(() => {
        if (dataFetcher.data) {
            if (dataFetcher.data.ok) {
                const textBox = (dataFetcher.data as (ApiResponseDataType<{textBox: TextBox}> | undefined))?.payload?.textBox
                if (textBox) {
                    const derivedEditorState = EditorState.createWithContent(
                        convertFromRaw(textBox))
                    setEditorState(derivedEditorState)
                }
            } else {}
        }
    }, [dataFetcher.data])

    // update the server with new textbox state
    const serializedContent = editorState && JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    useEffect(() => {(async () => {
        if (serializedContent){
            const formData = new FormData()
            formData.append("id", featureId.toString())
            formData.append("serializedContent", serializedContent)
            formData.append("updatedAt", Date.now().toString())
            updateFetcher.submit(formData, {method: "post", action: "api/textBox?index"})
        }
    })()}, [serializedContent])

    const syncState = (!updateFetcher.state || updateFetcher.state == "idle")
            ? "idle"
            : "syncing"

    return {editorState, setEditorState, syncState: syncState as typeof syncState}
}
