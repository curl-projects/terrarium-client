import React, {useState} from "react"
import { EditorState, RichUtils } from "draft-js"
import { BiBold, BiItalic, BiUnderline, BiListUl, BiListOl, BiCode } from 'react-icons/bi'
import ReactTooltip from "react-tooltip";

const BLOCK_TYPES = [
    {label: 'UL', style: 'unordered-list-item', icon: <BiListUl />},
    {label: 'OL', style: 'ordered-list-item', icon: <BiListOl />},
];

const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD', icon: <BiBold />, shortcut: "⌘ + B"},
    {label: 'Italic', style: 'ITALIC', icon: <BiItalic />, shortcut: "⌘ + I"},
    {label: 'Underline', style: 'UNDERLINE', icon: <BiUnderline />, shortcut: "⌘ + U"},
    {label: 'Monospace', style: 'CODE', icon: <BiCode />},
];


const StyleButton = (props) => {
    const tipId = "StyleButton-tip-" + props.style
    const [hovered, setHovered] = useState(false)
    const className = `toolbar-button${props.active && "-selected"}` +
        " bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"

    return (
        <>
            <div
                className={className}
                data-tip={true}
                data-for={tipId}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={(e) => {
                    e.preventDefault()
                    props.onToggle(props.style)
                    }}>
                {props.icon}
            </div>
            {props.shortcut &&
                <ReactTooltip
                    id={tipId}
                    effect="solid"
                    place="bottom"
                    type="dark">
                    <p style={{fontSize: "10px"}}>{props.shortcut}</p>
                </ReactTooltip>}
        </>
    )
}


const Toolbar = (props) => {
    const {editorState, setEditorState} = props
    const inlineStyle = editorState && editorState.getCurrentInlineStyle()
    const blockType = editorState && editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType()

    const handleToggleSelection = (style, inline) => {
        if (editorState && setEditorState) {
            const func = inline ? RichUtils.toggleInlineStyle : RichUtils.toggleBlockType
            setEditorState(func(editorState, style))
        }
    }

    return (
        <div id="editor-toolbar" className="flex gap-2 bg-white"
             style={{position: "absolute", bottom: "10px", right: "10px"}}>
            <div className="flex gap-0">
                {INLINE_STYLES.map(({label, style, icon, shortcut}) => (
                    <StyleButton
                        key={label}
                        active={!!inlineStyle && inlineStyle.has(style)}
                        icon={icon}
                        style={style}
                        onToggle={style => handleToggleSelection(style, true)}
                        shortcut={shortcut}/>
                ))}
            </div>
            <div className="flex gap-0">
                {BLOCK_TYPES.map(({label, style, icon}) => (
                    <StyleButton
                        key={label}
                        active={blockType === style}
                        icon={icon}
                        style={style}
                        onToggle={style => handleToggleSelection(style, false)}
                        />
                ))}
            </div>
        </div>
    )
}

export default Toolbar
