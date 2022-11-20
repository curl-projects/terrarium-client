import React, { useState, useEffect } from "react";
import styles from './KanbanBoard.module.css'

import { DragDropContext} from "react-beautiful-dnd";
import { useQuery, useMutation, gql } from '@apollo/client';
import ProcessCardState from 'utility/processCardState.js'

// Component Imports
import KanbanHeader from '../KanbanHeader/KanbanHeader.js'
import KanbanColumn from '../KanbanColumn/KanbanColumn.js'
import CreateCardButton from '../CreateCardButton/CreateCardButton.js'

import { ALL_TASKS, UPDATE_TASK_COLUMN } from 'utility/graphql.js'



// Creates a scaffold for the state that involves all relevant attributes
const columnsFromBackend = {
  1: {
    name: "To do",
    items: []
  },
  2: {
    name: "In Progress",
    items: []
  },
  3: {
    name: "Done",
    items: []
  }
};

function KanbanBoard() {
  const { data, loading, error } = useQuery(ALL_TASKS)
  const [columnOne, setColumnOne] = useState([])
  const [columnTwo, setColumnTwo] = useState([])
  const [columnThree, setColumnThree] = useState([])

  // mutation for updating the column for each card in the backend
  const [updateTaskColumn, {data: cardData,
                            loading: cardLoading,
                            error: cardError}] = useMutation(UPDATE_TASK_COLUMN)



  // Function called whenever a card is dropped -- maintains frontend and backend state
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // If moving between lists, update droppable and index
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
      // update the backend so that it's in sync with the frontend
      updateTaskColumn({variables:
                        {id: result.draggableId,
                         cardState: parseInt(result.destination.droppableId),
                         }})

    } else {
      // if not moving between lists, rearrange indexes
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };

  // Used for processing the input data from the backend and capturing it in state
  useEffect(()=>{
    setColumnOne(ProcessCardState(data ? data.allTasks : [])[0])
    setColumnTwo(ProcessCardState(data ? data.allTasks : [])[1])
    setColumnThree(ProcessCardState(data ? data.allTasks : [])[2])
  }, [data])

  useEffect(()=>{
    console.log("PROCESS:", ProcessCardState(data ? data.allTasks : []))
  }, [data])

  // State that captures all columns
  const [columns, setColumns] = useState(columnsFromBackend);

  // Updates all columns with the cards associated with them
  useEffect(()=>{
    setColumns(
      {
        1: {
          name: "To do",
          items: columnOne,
          color: "#E1E4E8",
        },
        2: {
          name: "In Progress",
          items: columnTwo,
          color: "#F0E7F6",
        },
        3: {
          name: "Complete",
          items: columnThree,
          color: "#FFDCE0",
        }
      }
    )}, [columnOne, columnTwo, columnThree])

  return (
    <div className={styles.kanbanBoard}>
    <KanbanHeader />

    <div className={styles.kanbanContent}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <KanbanColumn columnId={columnId} column={column} index={index}/>
          );
        })}
      </DragDropContext>
      </div>
    </div>
  );
}

export default KanbanBoard;
