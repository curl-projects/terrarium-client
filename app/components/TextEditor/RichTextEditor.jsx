import {useRef, useState} from "react";
import { EditorState, RichUtils } from 'draft-js';
import Editor from "@draft-js-plugins/editor";
import { DraftHandleValue } from "draft-js";
import {CgSpinner} from "react-icons/cg";
import { useTextBox } from "~/components/TextEditor/useTextBox";

import SyncIndicator from "./SyncIndicator";
import Toolbar from "~/components/TextEditor/ToolBar"

import createAutoListPlugin from 'draft-js-autolist-plugin'
const autoListPlugin = createAutoListPlugin()

function RichTextEditor(props){

    const {editorState, setEditorState, syncState} = useTextBox({featureId: props.featureId})
    const editorRef = useRef(null)

    const handleKeyCommand = (command, state) => {
        const newState = RichUtils.handleKeyCommand(state, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }
    const handleTab = (e) => {
        if (editorState) {
            setEditorState(RichUtils.onTab(e, editorState, 6))
        }
    }
    const focus = () => {
        editorRef.current?.focus()
    }

    return (
        <div className='editorOuterWrapper'>
            <div
                onClick={focus}
                className='editorWrapper'>
                {editorState
                    && (
                        <div style={{overflow: "scroll"}}>
                            <Editor
                                plugins={[
                                    autoListPlugin,
                                ]}
                                editorState={editorState}
                                onChange={setEditorState}
                                handleKeyCommand={handleKeyCommand}
                                // onTab={handleTab}
                                ref={editorRef}
                                readOnly={props.readOnly}
                                placeholder={"Write notes here!"}
                                />
                        </div>
            )}
            </div>
            <div className='editorControlsBar'>
                <div className="syncIndicatorWrapper">
                    {editorState 
                        ? <SyncIndicator syncState={syncState}/>
                        : <></>
                    }
                </div>
                <div style={{flex: 1}}/>
                <Toolbar
                    editorState={editorState || undefined}
                    setEditorState={setEditorState || undefined}/>
            </div>
        </div>
        
    )
}

export default RichTextEditor
