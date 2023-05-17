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
        <div className='kanbanColumnHeader'>
            <div className="kanbanColumnHeaderTextWrapper"><p className="kanbanColumnHeaderText">Roadmap</p></div>
            <div className='messageNumberWrapper'><p className="messageNumber">3</p></div>
            <div style={{flex: 1}} />
            <div className='addMessageWrapper'><p className='addMessage'>+</p></div>
        </div>
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
                    {props.column.items && props.column.items.map((item, index) => {
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
        <div className='roadmapControlPanel'>
            <Form method='post'>
                <input type="hidden" name='actionType' value='create'/>
                <input type='hidden' name="columnState" value={props.columnId}/>
                <input type='hidden' name="rankState" value={props.column.items ? props.column.items.length + 1: 0}/>
                <button>
                    <p className='newTopicButton'>New Topic</p>
                </button>
            </Form>
        </div>
    </div>
  )
}
