import React from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";



const COLUMN_TITLES = {
  todo: "To Do",
  inProgress: "In Progress",
  peerReview: "Peer Review",
  done: "Done",
};

const COLUMN_COLORS = {
  todo: "orange",
  inProgress: "green",
  peerReview: "yellow",
  done: "purple",
};

const Column = ({ id, tasks, searchTerm }) => {
  return (
    <div className={`column ${COLUMN_COLORS[id]}`}>
      <h2>{COLUMN_TITLES[id]}</h2>
      <Droppable droppableId={id}>
        {(provided) => (
          <div className="contentbox" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks
              .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((task, index) => (
                <Task key={task.id} task={task} index={index} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
