import { Form } from "@remix-run/react";
import { Droppable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import RoadmapCard from '~/components/Roadmap/RoadmapCard.js'
import { BsPlus } from "react-icons/bs";
import { Tooltip } from "@mui/material";

export default function RoadmapColumn(props){
  return(
    <div
      className='kanbanColumnOuter'
      key={props.columnId}
    >
        <div className='kanbanColumnHeader'>
            <div className="kanbanColumnHeaderTextWrapper" style={{"backgroundColor": props.column.color}}>
                {/* <div style={{flex: 1}}/> */}
                <Tooltip title={props.column.name} placement='left'>
                    <p className="kanbanColumnHeaderText" style={{color: props.column.color}}>
                        {props.column.icon}
                        {/* {props.column.name} */}
                    </p>
                </Tooltip>
                <div style={{flex: 1}}/>
            </div>
            {/* <div className='messageNumberWrapper'><p className="messageNumber">{props.column.items ? props.column.items.length : 0}</p></div> */}
            {/* <div style={{flex: 1}} /> */}
            {/* <div className='addMessageWrapper'>
                <input type="hidden" name='actionType' value='create'/>
                <input type='hidden' name="columnState" value={props.columnId}/>
                <input type='hidden' name="rankState" value={props.column.items ? props.column.items.length + 1: 0}/>
                <button type="submit">
                    <p className="addMessage" style={{fontSize: '24px', fontWeight: "450", color: props.column.color, cursor: "unset" }}>{props.column.items ? props.column.items.length : 0}</p>
                </button>
            </div> */}
            {/* <Form method='post' className='addMessageWrapper'>
                <input type="hidden" name='actionType' value='create'/>
                <input type='hidden' name="columnState" value={props.columnId}/>
                <input type='hidden' name="rankState" value={props.column.items ? props.column.items.length + 1: 0}/>
                <button type="submit">
                    <p className='addMessage' style={{color: props.column.color}}>
                        <BsPlus/>
                    </p>
                </button>
            </Form> */}
        </div>
        <Droppable droppableId={props.columnId} key={props.columnId}>
            {(provided, snapshot) => {
            return (
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                    width: '100%',
                    // height: "100%",
                    minHeight: "2px",
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
                                    placeholder={props.placeholder}
                                    />
                    );
                })}
                </div>
                {provided.placeholder}
                </div>
            );
            }}
        </Droppable>
        <Form className="newRoadmapCardWrapper" method='post'>
            <input type="hidden" name='actionType' value='create'/>
            <input type='hidden' name="columnState" value={props.columnId}/>
            <input type='hidden' name="rankState" value={props.column.items ? props.column.items.length + 1: 0}/>
            {props.placeholder ?
            <p className='newRoadmapCardText'>
                <BsPlus />
            </p>
            :
            <button className='newRoadmapCardText'>
                <BsPlus />
            </button>
            }
            {/* <p className='newRoadmapCardSpecifier'>Create a new feature</p> */}
        </Form>
    </div>
  )
}