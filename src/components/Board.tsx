import React, { useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import type { TaskStatus, Priority, Task } from '../types';

interface BoardProps {
    searchQuery: string;
    filterPriority: Priority | 'ALL';
    onEditTask: (task: Task) => void;
}

const Board: React.FC<BoardProps> = ({ searchQuery, filterPriority, onEditTask }) => {
    const tasks = useTaskStore((state) => state.tasks);
    const moveTask = useTaskStore((state) => state.moveTask);

    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
            return matchesSearch && matchesPriority;
        });
    }, [tasks, searchQuery, filterPriority]);

    const columns = useMemo(() => {
        // Priority weights for sorting: LOW (top) -> MEDIUM -> HIGH (bottom)
        const priorityWeight: Record<Priority, number> = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
        };

        const sortTasks = (tasksToSort: typeof tasks) => {
            return [...tasksToSort].sort((a, b) => {
                const weightA = priorityWeight[a.priority as Priority] || 99;
                const weightB = priorityWeight[b.priority as Priority] || 99;
                return weightA - weightB;
            });
        };

        const cols: Record<TaskStatus, typeof tasks> = {
            TODO: sortTasks(filteredTasks.filter((t) => t.status === 'TODO')),
            IN_PROGRESS: sortTasks(filteredTasks.filter((t) => t.status === 'IN_PROGRESS')),
            DONE: sortTasks(filteredTasks.filter((t) => t.status === 'DONE')),
        };
        return cols;
    }, [filteredTasks]);

    const onDragEnd = (result: DropResult) => {
        const { destination, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === result.source.droppableId &&
            destination.index === result.source.index
        ) {
            return;
        }

        moveTask(draggableId, destination.droppableId as TaskStatus);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div
                className="kanban-board-container"
                style={{
                    display: 'flex',
                    gap: '32px',
                    padding: '24px',
                    height: 'calc(100vh - 140px)',
                    overflowX: 'auto',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start', // Allows scrolling on small screens
                    scrollBehavior: 'smooth'
                }}>
                <Column
                    title="To Do"
                    status="TODO"
                    tasks={columns.TODO}
                    color="var(--col-todo)"
                    onEditTask={onEditTask}
                />
                <Column
                    title="In Progress"
                    status="IN_PROGRESS"
                    tasks={columns.IN_PROGRESS}
                    color="var(--col-progress)"
                    onEditTask={onEditTask}
                />
                <Column
                    title="Done"
                    status="DONE"
                    tasks={columns.DONE}
                    color="var(--col-done)"
                    onEditTask={onEditTask}
                />
            </div>
        </DragDropContext>
    );
};

export default Board;
