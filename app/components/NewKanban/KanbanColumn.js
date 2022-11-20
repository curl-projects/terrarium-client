import { Droppable } from "@hello-pangea/dnd";
import KanbanCard from '~/components/NewKanban/KanbanCard.js'


export default function KanbanColumn(props){

  console.log('COLUMN ID:', props.columnId)
  return(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "rgb(236, 240, 241)"
      }}
      key={props.columnId}
    >
      <div className="columnTitleWrapper" style={{backgroundColor: props.column.color}}>
        <h2 className="columnTitleText">{props.column.name}</h2>
      </div>
      <div style={{ margin: 8 }}>
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
                  width: 350,
                  margin: 10,
                  minHeight: 500,
                  borderRadius: "8px"
                }}
              >
                  {props.column.items.map((item, index) => {
                  return (
                    <KanbanCard item={item} index={index}/>
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
