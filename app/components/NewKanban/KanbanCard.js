import { Form, Link } from "@remix-run/react"
import { Draggable } from "@hello-pangea/dnd";
import deleteButton from "../../../public/assets/delete-button.png"

export default function KanbanCard(props){
  return(
    <Draggable
      draggableId={String(props.item.id)}
      key={String(props.item.id)}
      index={props.index}
      >
      {(provided, snapshot) => {
        return (
          <Link to={`/feature/${props.item.title.toLowerCase().replace(" ", "-")}-${props.item.id}`}
                style={{
                  textDecoration: "none"
                }}>
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
              <div className="headerTextWrapper">
              <p className="headerText">
                {props.item ? props.item.title : ""} {props.item ? props.item.id : ""}
              </p>
              </div>
              <div style={{flex: 1}}/>
              <div className='deleteCardButtonWrapper'>
                <Form method='post'>
                  <input type="hidden" name='actionType' value='delete'/>
                  <input type="hidden" name='featureId' value={props.item.id}/>
                  <button type="submit">
                    <img className="deleteCardButton" src={deleteButton} alt="X"></img>
                  </button>
                </Form>
              </div>

            </div>
            <div className="cardContent">
              <p className="contentText">
                {props.item ? props.item.description : ""}
              </p>
            </div>
          </div>
        </div>
        </Link>
        );
      }}

    </Draggable>
  )
}

// <DeleteCardButton item={props.item}/>
