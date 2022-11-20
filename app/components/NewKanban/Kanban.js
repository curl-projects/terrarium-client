import { useState, useEffect } from 'react';
import { DragDropContext} from "@hello-pangea/dnd";
import KanbanColumn from '~/components/NewKanban/KanbanColumn.js'

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

export default function Kanban(){
  const [columns, setColumns] = useState(columnsFromBackend);

  const [columnOne, setColumnOne] = useState([{id: "1", title: "Test One", description: "This is test one", cardState: 1}])
  const [columnTwo, setColumnTwo] = useState([])
  const [columnThree, setColumnThree] = useState([])


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

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    console.log("SOURCE:", source)
    console.log("DESTINATION:", destination)

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
      // // update the backend so that it's in sync with the frontend
      // updateTaskColumn({variables:
      //                   {id: result.draggableId,
      //                    cardState: parseInt(result.destination.droppableId),
      //                    }})

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

  return(
    <div className="kanbanBoard">
      <div className="kanbanContent">
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <KanbanColumn key={columnId} columnId={columnId} column={column} index={index}/>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  )
}
