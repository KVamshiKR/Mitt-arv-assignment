import React from "react";
import { Draggable } from "@hello-pangea/dnd";


const Task = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="note"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="taskname">{task.title}</div>
          <div className="taskdesc">{task.description}</div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
