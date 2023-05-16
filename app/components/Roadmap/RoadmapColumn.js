import { Form } from "@remix-run/react";

import { Droppable } from "@hello-pangea/dnd";
import RoadmapCard from '~/components/Roadmap/RoadmapCard.js'
import plusButton from "../../../public/assets/plus-button.png"

export default function KanbanColumn(props){

  return(
    <div
      className='kanbanColumnOuter'
      key={props.columnId}
    >
      <div className='kanbanColumnInner'>
        <Droppable droppableId={props.columnId} key={props.columnId}>
          {(provided, snapshot) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  padding: "30px",
                  width: '100%',
                  height: "100%",
                  overflow: "scroll",
                }}
              >
                  {props.column.items.map((item, index) => {
                  return (
                    <RoadmapCard key={index}
                                 item={item}
                                 index={index}
                                 updateHoveredData={props.updateHoveredData}
                                 />
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
      <div className='roadmapControlPanel'>
            <p className='newTopicButton'>New Topic</p>
    </div>
    </div>
  )
}
