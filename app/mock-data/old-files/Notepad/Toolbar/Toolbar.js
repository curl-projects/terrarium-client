import React from "react";
import { RichUtils } from "draft-js";
import { BiBold, BiItalic, BiUnderline, BiListUl, BiListOl, BiCodeBlock } from 'react-icons/bi';

const inlineStyles = [
  { type: "BOLD", label: <BiBold />, toolTip: "Bold" },
  { type: "ITALIC", label: <BiItalic />, toolTip: "Italic" },
  { type: "UNDERLINE", label: <BiUnderline />, toolTip: "Underline" },
  { type: "CODE", label: <BiCodeBlock />, toolTip: "Code Block" },
];

const blockStyles = [
  { type: "unordered-list-item", label: <BiListUl />, toolTip: "Unordered List" },
  { type: "ordered-list-item", label: <BiListOl />, toolTip: "Ordered List" },
];

const Toolbar = (props) => {
  const { editorState, setEditorState } = props;

  const handleInlineStyle = (event, style) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockStyle = (event, block) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, block));
  };

  const renderInlineStyleButton = (style, index) => {
    const currentInlineStyle = editorState.getCurrentInlineStyle();
    let className = "toolbar-button";
    if (currentInlineStyle.has(style.type)) {
      className = "toolbar-button-selected";
    }

    return (

      <button
        key={index}
        title={style.toolTip}
        onMouseDown={(event) => handleInlineStyle(event, style.type)}
        onClick={(event) => event.preventDefault()}
        className={className + " bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"}
      >
        {style.label}
      </button>

    );
  };

  const renderBlockStyleButton = (block, index) => {
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    let className = "toolbar-button";
    if (currentBlockType === block.type) {
      className = "toolbar-button-selected";
    }

    return (
      <button
        key={index}
        title={block.toolTip}
        onMouseDown={(event) => handleBlockStyle(event, block.type)}
        onClick={(event) => event.preventDefault()}
        className={className + " bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"}
      >
        {block.label}
      </button>
    );
  };

  return (
    <div id="editor-toolbar" className="flex mx-auto gap-2 bg-white">

      <div className="flex gap-0">
        {inlineStyles.map((style, index) => {
          return renderInlineStyleButton(style, index);
        })}
      </div>
      <div className="flex gap-0">
        {blockStyles.map((block, index) => {
          return renderBlockStyleButton(block, index);
        })}

      </div>

    </div>
  );
};

export default Toolbar;
