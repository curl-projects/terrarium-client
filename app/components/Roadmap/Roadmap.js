import { useFetcher } from "@remix-run/react";
import { useState, useEffect } from 'react';
import { DragDropContext} from "@hello-pangea/dnd";
import RoadmapColumn from '~/components/Roadmap/RoadmapColumn.js'

import { GoTelescope } from 'react-icons/go'
import { MdOutlineLightbulb } from "react-icons/md"
import { AiTwotoneExperiment } from "react-icons/ai"

import { BiArchive } from "react-icons/bi"

const columnsFromBackend = {};

export default function Roadmap(props){
const [columns, setColumns] = useState(columnsFromBackend);

  const [columnOne, setColumnOne] = useState([])
  const [columnTwo, setColumnTwo] = useState([])
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
          color: "rgba(119, 153, 141, 0.80)",
          backgroundColor: "rgba(119, 153, 141, 0.3)",
          icon: <GoTelescope />,
        },
        2: {
            name: "Drafts",
            items: columnTwo,
            color: "rgba(119, 153, 141, 0.5)",
            backgroundColor: "rgba(119, 153, 141, 0.15)",
            icon: <MdOutlineLightbulb />,
          },
        3: {
        name: "Archive",
        items: columnThree,
        color: "rgba(75, 85, 99, 0.3)",
        backgroundColor: "rgba(75, 85, 99, 0.1)",
        icon: <BiArchive />
        },

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
      })}, {method: 'get', action: "utils/update-feature-positions"})

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

      fetcher.submit({ columns: JSON.stringify({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      })}, {method: 'get', action: "utils/update-feature-positions"})
    }
  };

  return(
    <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
    >
        {Object.entries(columns).map(([columnId, column], index) => {
        return (
            <RoadmapColumn key={columnId}
                            columnId={columnId}
                            column={column}
                            index={index}
                            />
        );
        })}
    </DragDropContext>
  )
}