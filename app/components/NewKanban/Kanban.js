import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from 'react';
import { DragDropContext} from "@hello-pangea/dnd";
import KanbanColumn from '~/components/NewKanban/KanbanColumn.js'

const columnsFromBackend = {
  1: {
    name: "Roadmap",
    items: []
  },
  2: {
    name: "Workspace",
    items: []
  },
  3: {
    name: "Drafts",
    items: []
  }
};

export default function Kanban(props){
  const [columns, setColumns] = useState(columnsFromBackend);

  const [columnOne, setColumnOne] = useState([{id: "1", title: "Test One", description: "This is test one", cardState: 1}])
  const [columnTwo, setColumnTwo] = useState([{id: "2", title: "Test Two", description: "This is test two", cardState: 2}])
  const [columnThree, setColumnThree] = useState([])

  const fetcher = useFetcher();

  useEffect(()=>{
    setColumnOne(props.features[0])
    setColumnTwo(props.features[1])
    setColumnThree(props.features[2])
  }, [props.features])

  useEffect(()=>{
    setColumns(
      {
        1: {
          name: "Roadmap",
          items: columnOne,
          color: "#E1E4E8",
        },
        2: {
          name: "Workspace",
          items: columnTwo,
          color: "#F0E7F6",
        },
        3: {
          name: "Drafts",
          items: columnThree,
          color: "#FFDCE0",
        }
      }
    )}, [columnOne, columnTwo, columnThree])

  const onDragEnd = async(result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // If moving between lists, update droppable and index
    if (source.droppableId !== destination.droppableId){
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

      fetcher.submit({ columns: JSON.stringify({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      }), actionType: 'update'}, {method: 'get', action: "utils/update-feature-positions"})

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


      // fetcher.submit({ columns: JSON.stringify({
      //   ...columns,
      //   [source.droppableId]: {
      //     ...column,
      //     items: copiedItems
      //   }
      // })}, {method: 'post', action: "utils/update-feature-positions"})
    }
  };

  return(
    <div className="kanbanBoard">
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
  )
}
