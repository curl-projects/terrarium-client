
import { ClientOnly } from "remix-utils";
import { useParams } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import createAutoListPlugin from 'draft-js-autolist-plugin'
import Editor from "@draft-js-plugins/editor";
import { ContentState, convertFromRaw, convertToRaw, EditorState, RichUtils } from "draft-js"
import Toolbar from "~/components/TextEditor/ToolBar"
import SyncIndicator from "~/components/TextEditor/SyncIndicator";


const autoListPlugin = createAutoListPlugin()


export default function PlaceholderNotepad(props){
    const params = useParams();
    const [editorState, setEditorState] = useState(null)
    const editorRef = useRef(null)

    useEffect(()=>{
        const derivedEditorState = EditorState.createWithContent(
            ContentState.createFromText("Hi my name is Finn")
        )
        setEditorState(derivedEditorState)
    }, [])

    const handleKeyCommand = (command, state) => {
        const newState = RichUtils.handleKeyCommand(state, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }

    return(
        <div className='textEditorScaffold'>
            <ClientOnly>
            {() =>
                <div className='editorOuterWrapper'>
                <div
                    onClick={focus}
                    className='editorWrapper'>
                    <div style={{overflow: "scroll"}}>
                    {editorState &&
                        <Editor
                            plugins={[
                                autoListPlugin,
                            ]}
                            editorState={editorState}
                            onChange={setEditorState}
                            handleKeyCommand={handleKeyCommand}
                            // onTab={handleTab}
                            ref={editorRef}
                            readOnly={false}
                            placeholder={"Write notes here!"}
                            />
                    }
                    </div>
                </div>
                <div className='editorControlsBar'>
                    <div className="syncIndicatorWrapper">
                        {editorState 
                            ? <SyncIndicator syncState={true}/>
                            : <></>
                        }
                    </div>
                    <div style={{flex: 1}}/>
                    <Toolbar
                        editorState={editorState || undefined}
                        setEditorState={setEditorState || undefined}/>
                    </div>
                </div>
            }
            </ClientOnly> 
        </div>
    )
}