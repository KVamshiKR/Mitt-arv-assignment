import React, { useState, useEffect } from "react";
import Column from "./column";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const KanbanBoard = () => {
  const initialData = {
    todo: [],
    inProgress: [],
    peerReview: [],
    done: [],
  };

  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("kanbanTasks");
    return storedTasks ? JSON.parse(storedTasks) : initialData;
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const title = prompt("Enter Task Title:");
    const description = prompt("Enter Task Description:");
    if (title && description) {
      const newTask = { id: uuidv4(), title, description };
      setTasks((prev) => ({
        ...prev,
        todo: [...prev.todo, newTask],
      }));
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumn = tasks[source.droppableId];
    const destColumn = tasks[destination.droppableId];
    const movedTask = sourceColumn[source.index];

    // Remove from source
    const newSourceColumn = [...sourceColumn];
    newSourceColumn.splice(source.index, 1);

    // Add to destination
    const newDestColumn = [...destColumn];
    newDestColumn.splice(destination.index, 0, movedTask);

    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn,
    }));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="addtask" onClick={addTask}>Add Task</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.keys(tasks).map((columnId) => (
            <Column key={columnId} id={columnId} tasks={tasks[columnId]} searchTerm={searchTerm} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;
