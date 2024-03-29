import { useState } from 'react';
import { Form, Link, useSubmit } from "@remix-run/react"
import { Draggable } from "@hello-pangea/dnd";
import { BiDotsHorizontalRounded } from "react-icons/bi"
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export default function RoadmapCard(props){
    const submit = useSubmit();
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Draggable
            className='draggableKanbanCard'
            style={{overflow: "visible"}}
            draggableId={String(props.item.id)}
            key={String(props.item.id)}
            index={props.index}>
            {(provided, snapshot) => {
                return(
                <div className="kanbanCardWrapper" 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                      >
                    <div className='kanbanCardBookmark' style={{"backgroundColor": props.color}}></div>
                    <div className='kanbanCardContent'>
                        <div className='kanbanCardTitle'>
                            {props.placeholder ?
                                <h1 className='kanbanCardTitleText'> {props.item ? props.item.title : "Untitled"}</h1>
                            :
                                <Link to={`/feature/discovery/${props.item.id}`} >
                                <h1 className='kanbanCardTitleText'> {props.item ? props.item.title : "Untitled"}</h1>
                                </Link>
   
                            }
                            <div style={{flex: 1}}/>
                            {!props.placeholder && 
                            <div className='kanbanCardMenu'>
                                <BiDotsHorizontalRounded onClick={handleClick} style={{cursor: "pointer"}}/>
                                <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleClose}>
                                    <MenuItem onClick={handleClose}>
                                        <Form method='post' >
                                        <input type="hidden" name='actionType' value='delete'/>
                                        <input type="hidden" name='featureId' value={props.item.id}/>
                                        <button className='kanbanCardMenuItem'><p>Delete Question</p></button>
                                        </Form>
                                        </MenuItem>
                                </Menu>
                            </div>
                            }
                        </div>
                        <div className='kanbanCardPinned'>
                            <p className='kanbanCardPinnedText' style={{"color": props.color}}><em>{props.item ? props.item._count.featureRequests : 0} pinned {(props.item._count.featureRequests == 1) ? <span>message</span> : <span>messages</span>}</em></p>
                        </div>
                        <div className='kanbanCardDescription'>
                            <p className='kanbanCardDescriptionText'>{props.item ? props.item.description : ""}</p>
                        </div>
                    </div>
                </div>
                )
            }}
        </Draggable>
    )
    }