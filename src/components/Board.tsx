import React, { useMemo } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import Column from './Column';
import type { TaskStatus, Priority, Task } from '../types';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface BoardProps {
    searchQuery: string;
    filterPriority: string[];
    filterTags: string[];
    filterDate?: string; // 'all' | 'today' | 'week' | 'overdue'
    filterFavorite?: boolean;
    searchScope?: string; // 'all' | 'title' | 'tag'
    onEditTask: (task: Task) => void;
}

const Board: React.FC<BoardProps> = ({ searchQuery, filterPriority, filterTags, filterDate = 'all', filterFavorite = false, searchScope = 'all', onEditTask }) => {
    const tasks = useTaskStore((state) => state.tasks);
    const moveTask = useTaskStore((state) => state.moveTask);
    const updateTaskOrder = useTaskStore((state) => state.updateTaskOrder);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => {
            let matchesSearch = true;
            const query = searchQuery.toLowerCase();
            if (query) {
                // Strict filtering as per user request
                switch (searchScope) {
                    case 'title':
                        // Only search in Title
                        matchesSearch = t.title.toLowerCase().includes(query);
                        break;
                    case 'description':
                        // Only search in Description
                        matchesSearch = (t.description || '').toLowerCase().includes(query);
                        break;
                    case 'all':
                    default:
                        // Search in both Title OR Description
                        matchesSearch = t.title.toLowerCase().includes(query) ||
                            (t.description || '').toLowerCase().includes(query);
                        break;
                }
            }

            const matchesPriority = filterPriority.length === 0 || filterPriority.includes(t.priority);
            const matchesFavorite = !filterFavorite || (filterFavorite && t.isFavorite);
            // AND Condition: Task must have ALL selected tags
            const matchesTags = filterTags.length === 0 || filterTags.every(tag => t.tags && t.tags.includes(tag));
            // Date Filter Logic
            let matchesDate = true;
            if (filterDate && filterDate !== 'all') {
                const now = new Date();
                const todayValues = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

                if (filterDate === 'overdue') {
                    if (t.dueDate) {
                        const deadlineDate = new Date(t.dueDate).getTime();
                        if (filterDate === 'overdue') matchesDate = deadlineDate < todayValues && t.status !== 'DONE';
                        else if (filterDate === 'today') {
                            const d = new Date(t.dueDate);
                            matchesDate = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
                        }
                        else if (filterDate === 'week') {
                            const nextWeek = new Date(todayValues + 7 * 24 * 60 * 60 * 1000).getTime();
                            const deadline = new Date(t.dueDate).getTime();
                            matchesDate = deadline >= todayValues && deadline <= nextWeek;
                        }
                    } else {
                        matchesDate = false;
                    }
                } else {
                    if (t.dueDate) {
                        const deadlineDate = new Date(t.dueDate).getTime();
                        if (filterDate === 'today') {
                            const d = new Date(t.dueDate);
                            matchesDate = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
                        } else if (filterDate === 'week') {
                            const nextWeek = new Date(todayValues + 7 * 24 * 60 * 60 * 1000).getTime();
                            matchesDate = deadlineDate >= todayValues && deadlineDate <= nextWeek;
                        }
                    } else {
                        matchesDate = false;
                    }
                }
            }

            return matchesSearch && matchesPriority && matchesTags && matchesDate && matchesFavorite;
        });
    }, [tasks, searchQuery, filterPriority, filterTags, searchScope, filterDate, filterFavorite]);

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
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '40px' : '32px', // Larger gap for visual separation on mobile
                    padding: '24px',
                    paddingBottom: isMobile ? '150px' : '24px', // Extra padding at bottom for mobile scrolling
                    height: isMobile ? 'auto' : 'calc(100vh - 140px)', // Auto height on mobile for Page Scroll
                    overflowX: isMobile ? 'hidden' : 'auto',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
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
