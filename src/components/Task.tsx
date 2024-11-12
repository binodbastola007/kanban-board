import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task as TaskType } from '../interfaces/KanbanInterfaces';

interface TaskProps {
    task: TaskType;
    index: number;
}

const Task: React.FC<TaskProps> = ({ task, index }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided) => (
                <div
                    className="task"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {task.content}
                </div>
            )}
        </Draggable>
    );
};

export default Task;
