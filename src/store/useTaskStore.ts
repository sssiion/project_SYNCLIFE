import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TasksState } from '../types';

const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Research Competitors', description: 'Analyze top 3 competitors.', status: 'TODO', priority: 'HIGH', createdAt: Date.now() },
    { id: '2', title: 'Draft Design System', description: 'Define colors and typography.', status: 'TODO', priority: 'MEDIUM', createdAt: Date.now() },
    { id: '3', title: 'Setup Repo', description: 'Initialize React project.', status: 'IN_PROGRESS', priority: 'HIGH', createdAt: Date.now() },
    { id: '4', title: 'Implement Auth', description: 'Login and Signup pages.', status: 'DONE', priority: 'HIGH', createdAt: Date.now() },
];

export const useTaskStore = create<TasksState>()(
    persist(
        (set) => ({
            tasks: INITIAL_TASKS,
            addTask: (taskData) => set((state) => ({
                tasks: [...state.tasks, { ...taskData, id: uuidv4(), createdAt: Date.now() }]
            })),
            moveTask: (id, newStatus) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, status: newStatus } : task
                )
            })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updates } : task
                )
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id)
            })),
        }),
        {
            name: 'task-storage',
        }
    )
);
