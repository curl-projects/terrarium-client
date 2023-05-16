import { Form, Link } from "@remix-run/react"
import { Draggable } from "@hello-pangea/dnd";
import deleteButton from "../../../public/assets/delete-button.png"
import cn from "classnames";

export default function KanbanCard(props){
    return(
        <Draggable
            draggableId={String(props.item.id)}
            key={String(props.item.id)}
            index={props.index}>
            {(provided, snapshot) => {
                return(
                <Link className="kanbanCardWrapper" 
                      to={`/feature/discovery/${props.item.id}`} 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      >
                    <div className='kanbanCardBookmark'></div>
                    <div className='kanbanCardContent'>
                        <div className='kanbanCardTitle'>
                            <h1 className='kanbanCardTitleText'> {props.item ? props.item.title : "Untitled"}</h1>
                        </div>
                        <div className='kanbanCardPinned'>
                            <p className='kanbanCardPinnedText'><em>5 pinned messages</em></p>
                        </div>
                        <div className='kanbanCardDescription'>
                            <p className='kanbanCardDescriptionText'>No description</p>
                        </div>
                    </div>
                </Link>
                )
            }}
        </Draggable>
    )
    }