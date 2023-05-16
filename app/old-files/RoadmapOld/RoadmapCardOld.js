import { Form, Link } from "@remix-run/react"
import { Draggable } from "@hello-pangea/dnd";
import deleteButton from "../../../public/assets/delete-button.png"
import cn from "classnames";

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
              margin: "8px",
              height: "fit-content",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
              border: "1px solid #DDDDDD",
              borderRadius: "0px 4px 4px 0px",
              display: "flex",
              flexDirection: 'row',
              backgroundColor: snapshot.isDragging
                ? "rgb(232, 236, 241)"
                : "white",
              color: "white",
              ...provided.draggableProps.style
            }}
            onMouseEnter={(event)=>props.updateHoveredData(event, props.item.id)}
            onMouseOut={(event)=>props.updateHoveredData(event, false)}
          >
          <div className='roadmapIndicatorWrapper'>
            <h2 className='roadmapIndicator'>{props.index + 1}</h2>
          </div>
          <div className="cardContentWrapper">
            <div className="cardHeader">
              <Link to={`/feature/discovery/${props.item.id}`}
                    style={{
                      textDecoration: "none"
                    }}>
              <div className="headerTextWrapper">
              <p className="headerText">
                {props.item ? props.item.title : ""}
              </p>
              </div>
              </Link>
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

          </div>
        </div>
        );
      }}

    </Draggable>
  )
}

// <div className="cardContent">
//   <p className="contentText">
//     {props.item ? props.item.description : ""}
//   </p>
// </div>
