import { Form } from "@remix-run/react";

import { Droppable } from "@hello-pangea/dnd";
import KanbanCard from '~/components/NewKanban/KanbanCard.js'
import plusButton from "../../../public/assets/plus-button.png"

export default function KanbanColumn(props){

  return(
    <div
      className='kanbanColumnOuter'
      key={props.columnId}
    >
      <div className="columnNameWrapper" style={{backgroundColor: props.column.color}}>
        <h2 className="columnName">{props.column.name}</h2>
        <div style={{flex: 1}}/>
        <div className='addCardWrapper'>
          <Form method="post">
            <button type="submit">
              <input type="hidden" name='actionType' value='create'/>
              <input type='hidden' name="columnState" value={props.columnId}/>
              <input type='hidden' name="rankState" value={props.column.items.length + 1}/>
              <img src={plusButton} alt="+" className='addCardButton'></img>
            </button>
          </Form>
        </div>
      </div>
      <div className='kanbanColumnInner'>
        <Droppable droppableId={props.columnId} key={props.columnId}>
          {(provided, snapshot) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver
                    ? `${props.column.color}`
                    : "rgb(236, 240, 241)",
                  padding: 4,
                  width: '100%',
                  height: "100%",
                  maxHeight: "89%",
                  borderRadius: "8px",
                  overflow: "scroll"
                }}
              >
                  {props.column.items.map((item, index) => {
                  return (
                    <KanbanCard key={index} item={item} index={index}/>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    </div>
  )
}
