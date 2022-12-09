import React, {SyntheticEvent, useRef, useState} from "react"
import { EditorState, RichUtils } from 'draft-js'
import Editor from "@draft-js-plugins/editor"
import { DraftHandleValue } from "draft-js"
import {CgSpinner} from "react-icons/cg"
import {useTextBox} from "~/components/TextEditor/useTextBox"

import SyncIndicator from "./SyncIndicator"
import Toolbar from "app/components/TextEditor/ToolBar"

import createAutoListPlugin from 'draft-js-autolist-plugin'
const autoListPlugin = createAutoListPlugin()

type RichTextEditorType = {
    readOnly?: boolean,
    placeholder?: string,
    className?: string,
}

const RichTextEditor: React.FC<RichTextEditorType> = (props) => {

    const {editorState, setEditorState, syncState} = useTextBox({featureId: props.featureId})
    const editorRef = useRef<Editor | null>(null)

    const handleKeyCommand = (command: string, state: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(state, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }
    const handleTab = (e: any) => {
        if (editorState) {
            setEditorState(RichUtils.onTab(e, editorState, 6))
        }
    }
    const focus = () => {
        editorRef.current?.focus()
    }

    return (
        <div
            onClick={focus}
            className={'relative max-h-full overflow-auto flex flex-col gap-0' + props.className}>
            <Toolbar
                editorState={editorState || undefined}
                setEditorState={setEditorState || undefined}/>
            {editorState
                ? (
                    <>
                        <Editor
                            plugins={[
                                autoListPlugin,
                            ]}
                            editorState={editorState}
                            onChange={setEditorState}
                            handleKeyCommand={handleKeyCommand}
                            onTab={handleTab}
                            ref={editorRef}
                            readOnly={props.readOnly}
                            placeholder={"Write notes here!"}
                            />
                        <SyncIndicator syncState={syncState}/>
                    </>

                )
                : (
                    <div className="mx-auto flex p-3">
                        <CgSpinner className="animate-spin"/>
                    </div>
                )
            }

        </div>
    )
}

export default RichTextEditor
