import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from './Column';
import { BoardState } from '../interfaces/KanbanInterfaces';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import './styles.css';

const initialData: BoardState = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Task One' },
        'task-2': { id: 'task-2', content: 'Task Two' },
        'task-3': { id: 'task-3', content: 'Task Three' },
    },
    columns: {
        'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
        'column-2': { id: 'column-2', title: 'In Progress', taskIds: ['task-3'] },
    },
    columnOrder: ['column-1', 'column-2'],
};

const Board: React.FC = () => {
    const [boardState, setBoardState] = useState<BoardState>(() =>
        loadFromLocalStorage('kanban-board') || initialData
    );
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [history, setHistory] = useState<BoardState[]>([boardState]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        saveToLocalStorage('kanban-board', boardState);
    }, [boardState]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        const sourceColumn = boardState.columns[source.droppableId];
        const destinationColumn = boardState.columns[destination.droppableId];
        const sourceTasks = Array.from(sourceColumn.taskIds);
        sourceTasks.splice(source.index, 1);

        if (sourceColumn === destinationColumn) {
            sourceTasks.splice(destination.index, 0, draggableId);
            const newColumn = { ...sourceColumn, taskIds: sourceTasks };
            updateBoardState({
                columns: { ...boardState.columns, [newColumn.id]: newColumn },
            });
        } else {
            const destTasks = Array.from(destinationColumn.taskIds);
            destTasks.splice(destination.index, 0, draggableId);

            updateBoardState({
                columns: {
                    ...boardState.columns,
                    [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTasks },
                    [destinationColumn.id]: { ...destinationColumn, taskIds: destTasks },
                },
            });
        }
    };

    const updateBoardState = (newState: Partial<BoardState>) => {
        const newBoardState = { ...boardState, ...newState };
        setBoardState(newBoardState);
        setHistory((prev) => {
            const newHistory = prev.slice(0, currentIndex + 1);
            return [...newHistory, newBoardState];
        });
        setCurrentIndex((prev) => prev + 1);
    };

    const addColumn = () => {
        const newColumnId = `column-${Date.now()}`;
        const newColumn = { id: newColumnId, title: 'New Column', taskIds: [] };
        const newColumnOrder = [...boardState.columnOrder, newColumnId];

        updateBoardState({
            columns: { ...boardState.columns, [newColumnId]: newColumn },
            columnOrder: newColumnOrder,
        });
    };

    const deleteColumn = (columnId: string) => {
        const { [columnId]: _, ...remainingColumns } = boardState.columns;
        const newColumnOrder = boardState.columnOrder.filter((id) => id !== columnId);

        updateBoardState({
            columns: remainingColumns,
            columnOrder: newColumnOrder,
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredTasks = Object.values(boardState.tasks).filter((task) =>
        task.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const undo = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setBoardState(history[currentIndex - 1]);
        }
    };

    const redo = () => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setBoardState(history[currentIndex + 1]);
        }
    };

    return (
        <div>
            <div className='nav-childs'>
                <input
                    type="text"
                    placeholder="Search tasks"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                <div className="board-actions">
                    <button onClick={addColumn} className='nav-btns'>Add Column</button>
                    <button onClick={undo} disabled={currentIndex === 0}
                        className='nav-btns'
                    >
                        Undo
                    </button>
                    <button onClick={redo} disabled={currentIndex === history.length - 1}>
                        Redo
                    </button>
                </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board">
                    {boardState.columnOrder.map((columnId) => {
                        const column = boardState.columns[columnId];
                        const tasks = column.taskIds
                            .map((taskId) => boardState.tasks[taskId])
                            .filter((task) =>
                                task.content.toLowerCase().includes(searchQuery.toLowerCase())
                            );

                        return (
                            <Column
                                key={columnId}
                                column={column}
                                tasks={tasks}
                                onDelete={deleteColumn}
                                searchQuery={searchQuery}
                            />
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default Board;
