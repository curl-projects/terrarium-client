import { Draggable } from "@hello-pangea/dnd";

export default function KanbanCard(props){
  return(
    <Draggable
      draggableId={String(props.item.id)}
      key={String(props.item.id)}
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
              height: "fit-content",
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
          <div className="cardContentWrapper">
            <div className="cardHeader">
              <p className="headerText">
                {props.item ? props.item.title : ""}
              </p>
            </div>
            <div className="cardContent">
              <p className="contentText">
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

// <DeleteCardButton item={props.item}/>
