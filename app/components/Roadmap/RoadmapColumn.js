import { Form } from "@remix-run/react";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import RoadmapCard from '~/components/Roadmap/RoadmapCard.js'

export default function RoadmapColumn(props){
  return(
    <div
      className='kanbanColumnOuter'
      key={props.columnId}
    >
        <div className='kanbanColumnHeader'>
            <div className="kanbanColumnHeaderTextWrapper" style={{"backgroundColor": props.column.color}}><p className="kanbanColumnHeaderText">{props.column.name}</p></div>
            <div className='messageNumberWrapper'><p className="messageNumber">{props.column.items ? props.column.items.length : 0}</p></div>
            <div style={{flex: 1}} />
            <Form method='post'>
                <input type="hidden" name='actionType' value='create'/>
                <input type='hidden' name="columnState" value={props.columnId}/>
                <input type='hidden' name="rankState" value={props.column.items ? props.column.items.length + 1: 0}/>
                <button className='addMessageWrapper' type="submit"><p className='addMessage'>+</p></button>
            </Form>
        </div>
        <Droppable droppableId={props.columnId} key={props.columnId}>
            {(provided, snapshot) => {
            return (
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                    width: '100%',
                    height: "100%",
                    minHeight: "200px",
                    overflow: "scroll",
                    backgroundColor: snapshot.isDraggingOver
                    ? `${props.column.backgroundColor}`
                    : "white",
                }}
                >
                <div className="kanbanColumnHeaderSeparator"></div>
                <div >
                    {props.column.items.map((item, index) => {
                    return (
                    <RoadmapCard key={index}
                                    item={item}
                                    index={index}
                                    updateHoveredData={props.updateHoveredData}
                                    color={props.column.color}
                                    />
                    );
                })}
                </div>
                {provided.placeholder}
                </div>
            );
            }}
        </Droppable>
    </div>
  )
}