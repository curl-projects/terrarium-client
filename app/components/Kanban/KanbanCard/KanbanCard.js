import React from 'react';
import styles from './KanbanCard.module.css';
import {Draggable } from "react-beautiful-dnd";

import DeleteCardButton from '../DeleteCardButton/DeleteCardButton.js'

function KanbanCard(props){

  return(
    <Draggable
      key={props.item.id}
      draggableId={props.item.id}
      index={props.index}
    >
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              userSelect: "none",
              padding: 16,
              margin: "8px",
              minHeight: "50px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
              border: "1px solid #DDDDDD",
              borderRadius: "8px",

              backgroundColor: snapshot.isDragging
                ? "rgb(232, 236, 241)"
                : "white",
              color: "white",
              ...provided.draggableProps.style
            }}
          >
          <div className={styles.cardContentWrapper}>
            <div className={styles.cardHeader}>
            <div className={styles.headerTextWrapper}>
              <p className={styles.headerText}>
                {props.item ? props.item.title : ""}
              </p>
            </div>
              <DeleteCardButton item={props.item}/>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.contentText}>
                {props.item ? props.item.description : ""}
              </p>
            </div>
          </div>
        </div>
        );
      }}
    </Draggable>
  )
}

export default KanbanCard;
