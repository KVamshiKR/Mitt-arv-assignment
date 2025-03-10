import React, { useState, useEffect } from "react";
import Column from "./column";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { v4 as uuidv4 } from "uuid";

const initialData = {
  todo: [],
  inProgress: [],
  peerReview: [],
  done: [],
};

const KanbanBoard = () => {
  // Load tasks from local storage
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("kanbanTasks");
    return storedTasks ? JSON.parse(storedTasks) : initialData;
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to add a task
  const addTask = () => {
    const title = prompt("Enter Task Title:");
    let description = prompt("Enter a short Task Description:");
  
    // Ensuring the description is not longer than 50 characters
    if (description && description.length > 50) {
      description = description.slice(0, 50); // Trimming the description to 50 characters
      alert("Description is too long! It has been trimmed to 50 characters.");
    }
  
    if (title && description) {
      const newTask = { id: uuidv4(), title, description };
      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, newTask],
      }));
    }
  };
  

  const onDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing
  
    const { source, destination } = result;
  
    // Prevent unnecessary state updates if dropped in the same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
  
    // Deleting the task
    const sourceColumn = [...tasks[source.droppableId]];
  
    if (destination.droppableId === "delete") {
      // If dropped in delete box, remove the task
      sourceColumn.splice(source.index, 1);
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
      }));
    } else {
      const destColumn = [...tasks[destination.droppableId]];
      const [movedTask] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, movedTask);
  
      setTasks((prev) => ({
        ...prev,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      }));
    }
  };
  
  
  return (
    <div className="main">
      <div className="heading">
        <h1>KanBan Board</h1>
        <button className="addtask" onClick={addTask}>Add Task</button>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.keys(tasks).map((columnId) => (
            <Column key={columnId} id={columnId} tasks={tasks[columnId]} searchTerm={searchTerm} />
          ))}
        </div>

        {/* DELETE BOX - Drag tasks here to delete */}
        <Droppable droppableId="delete">
  {(provided, snapshot) => (
    <div className="deleteflex">
    <div
      className="delete-box"
      ref={provided.innerRef}
      {...provided.droppableProps}
      
    >
      <div>🗑 Drop here to delete</div>
      {provided.placeholder}
    </div>
    </div>
  )}
</Droppable>

      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
