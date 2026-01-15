import React, { useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import type { TaskStatus, Priority } from '../types';

interface BoardProps {
    searchQuery: string;
    filterPriority: Priority | 'ALL';
}

const Board: React.FC<BoardProps> = ({ searchQuery, filterPriority }) => {
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
        const cols: Record<TaskStatus, typeof tasks> = {
            TODO: filteredTasks.filter((t) => t.status === 'TODO'),
            IN_PROGRESS: filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
            DONE: filteredTasks.filter((t) => t.status === 'DONE'),
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
                />
                <Column
                    title="In Progress"
                    status="IN_PROGRESS"
                    tasks={columns.IN_PROGRESS}
                    color="var(--col-progress)"
                />
                <Column
                    title="Done"
                    status="DONE"
                    tasks={columns.DONE}
                    color="var(--col-done)"
                />
            </div>
        </DragDropContext>
    );
};

export default Board;
