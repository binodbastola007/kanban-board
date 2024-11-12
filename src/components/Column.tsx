import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Task from './Task';
import { Column as ColumnType, Task as TaskType } from '../interfaces/KanbanInterfaces';

interface ColumnProps {
    column: ColumnType;
    tasks: TaskType[];
    onDelete: (columnId: string) => void;
    searchQuery: string;
}

const Column: React.FC<ColumnProps> = ({ column, tasks, onDelete, searchQuery }) => {

    const filteredTasks = tasks.filter((task) =>
        task.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="column">
            <div className="column-header">
                <h2 className="column-title">{column.title}</h2>
                <button
                    className="delete-column-btn"
                    onClick={() => onDelete(column.id)}
                >
                    Delete Column
                </button>
            </div>
            <Droppable droppableId={column.id}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
                        {filteredTasks.map((task, index) => (
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
