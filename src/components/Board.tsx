import React, { useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import type { TaskStatus, Priority, Task } from '../types';

interface BoardProps {
    searchQuery: string;
    filterPriority: string[];
    filterTags: string[];
    onEditTask: (task: Task) => void;
}

const Board: React.FC<BoardProps> = ({ searchQuery, filterPriority, filterTags, onEditTask }) => {
    const tasks = useTaskStore((state) => state.tasks);
    const moveTask = useTaskStore((state) => state.moveTask);
    const updateTaskOrder = useTaskStore((state) => state.updateTaskOrder);

    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPriority = filterPriority.length === 0 || filterPriority.includes(t.priority);
            const matchesTags = filterTags.length === 0 || (t.tags && t.tags.some(tag => filterTags.includes(tag)));
            return matchesSearch && matchesPriority && matchesTags;
        });
    }, [tasks, searchQuery, filterPriority, filterTags]);

    const columns = useMemo(() => {
        // Priority weights for sorting: LOW (top) -> MEDIUM -> HIGH (bottom)
        const priorityWeight: Record<Priority, number> = {
            LOW: 1,
            MEDIUM: 2,
            HIGH: 3,
        };

        const sortTasks = (tasksToSort: typeof tasks) => {
            return [...tasksToSort].sort((a, b) => {
                // 1. Favorites always at top
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;

                // 2. Then by Priority (Level)
                const weightA = priorityWeight[a.priority as Priority] || 99;
                const weightB = priorityWeight[b.priority as Priority] || 99;
                if (weightA !== weightB) {
                    return weightA - weightB;
                }

                // 3. Then by Order (User manual sort)
                // Use order if available, else fallback to createdAt (older first or newer first? usually newer at bottom, so IDK. Let's say ascending order)
                const orderA = a.order ?? a.createdAt;
                const orderB = b.order ?? b.createdAt;
                return orderA - orderB;
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
        const { destination, draggableId, source } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        // Verify we are moving within the same board context (status)
        // If changing status:
        if (sourceStatus !== destStatus) {
            moveTask(draggableId, destStatus);
            // We could also apply ordering logic here if we wanted to place it specifically, 
            // but for now just move it. It will conform to sort rules.
            return;
        }

        // If Reordering within Same Status
        const columnTasks = columns[destStatus];

        // Note: The 'draggableId' is the task ID. 
        // We simulate the move in the current array to find neighbors.
        // The 'destination.index' is based on the *currently rendered list* (which is sorted).

        // Remove the item from its old position? 
        // No, 'destination.index' is already the visual target.
        // We just need to know what order value sits there.

        // Get the task being moved
        const movedTask = tasks.find(t => t.id === draggableId);
        if (!movedTask) return;

        // If we strictly follow the visual indices:
        // The list without the moved task:
        const remainingTasks = columnTasks.filter(t => t.id !== draggableId);

        // Ensure index is valid
        const validIndex = Math.min(destination.index, remainingTasks.length);

        // Neighbors
        const prevTask = remainingTasks[validIndex - 1];
        const nextTask = remainingTasks[validIndex];

        let newOrder: number;

        if (!prevTask && !nextTask) {
            // Only item
            newOrder = Date.now();
        } else if (!prevTask) {
            // Dropped at top
            newOrder = (nextTask.order ?? nextTask.createdAt) - 10000;
        } else if (!nextTask) {
            // Dropped at bottom
            newOrder = (prevTask.order ?? prevTask.createdAt) + 10000;
        } else {
            // Dropped between
            const prevOrder = prevTask.order ?? prevTask.createdAt;
            const nextOrder = nextTask.order ?? nextTask.createdAt;
            newOrder = (prevOrder + nextOrder) / 2;
        }

        updateTaskOrder(draggableId, newOrder);
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
                    searchQuery={searchQuery}
                />
                <Column
                    title="In Progress"
                    status="IN_PROGRESS"
                    tasks={columns.IN_PROGRESS}
                    color="var(--col-progress)"
                    onEditTask={onEditTask}
                    searchQuery={searchQuery}
                />
                <Column
                    title="Done"
                    status="DONE"
                    tasks={columns.DONE}
                    color="var(--col-done)"
                    onEditTask={onEditTask}
                    searchQuery={searchQuery}
                />
            </div>
        </DragDropContext>
    );
};

export default Board;
