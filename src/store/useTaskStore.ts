import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TasksState } from '../types';

const INITIAL_TASKS: Task[] = [
    { id: '1', title: '경쟁사 분석 보고서 작성', description: '주요 경쟁사 3곳의 기능 및 디자인 분석', status: 'todo', priority: 'high', createdAt: Date.now(), updatedAt: Date.now(), tags: ['분석', '기획'], isFavorite: true, assignee: '김철수', dueDate: Date.now() + 86400000 * 2 }, // D+2
    { id: '2', title: '디자인 시스템 가이드 초안', description: '메인 컬러 팔레트 및 폰트 계층 정의', status: 'todo', priority: 'medium', createdAt: Date.now() - 100000, updatedAt: Date.now() - 100000, tags: ['디자인'], assignee: '이영희' },
    { id: '3', title: '리액트 프로젝트 초기 설정', description: 'Vite 기반 프로젝트 생성 및 라이브러리 설치', status: 'done', priority: 'high', createdAt: Date.now() - 500000, updatedAt: Date.now() - 500000, isFavorite: true, tags: ['개발'] },
    { id: '4', title: '로그인/회원가입 페이지 구현', description: 'JWT 토큰 기반 인증 로직 연동', status: 'in-progress', priority: 'high', createdAt: Date.now() - 200000, updatedAt: Date.now() - 200000, tags: ['개발', '보안'], assignee: '박지성', dueDate: Date.now() + 86400000 * 5 }, // D+5
    { id: '5', title: 'API 명세서 검토', description: '백엔드팀과 데이터 구조 협의', status: 'todo', priority: 'low', createdAt: Date.now() - 150000, updatedAt: Date.now() - 150000 },
    { id: '6', title: '사용자 피드백 수집', description: '베타 테스터 설문조사 결과 정리', status: 'in-progress', priority: 'medium', createdAt: Date.now() - 300000, updatedAt: Date.now() - 300000, tags: ['피드백'], assignee: '손흥민' },
    { id: '7', title: '버그 수정: 모바일 헤더', description: '모바일 환경에서 메뉴가 겹치는 현상 수정', status: 'done', priority: 'high', createdAt: Date.now() - 600000, updatedAt: Date.now() - 600000, tags: ['버그'] },
    { id: '8', title: '주간 회의 자료 준비', description: '이번 주 스프린트 진행 상황 요약', status: 'todo', priority: 'low', createdAt: Date.now() - 50000, updatedAt: Date.now() - 50000 },
    { id: '9', title: 'CI/CD 파이프라인 구축', description: 'GitHub Actions를 이용한 자동 배포 설정', status: 'todo', priority: 'high', createdAt: Date.now() - 120000, updatedAt: Date.now() - 120000, isFavorite: true, assignee: '김연아', dueDate: Date.now() + 86400000 * 1 }, // D+1
    { id: '10', title: '다크 모드 테마 적용', description: '사용자 설정에 따른 테마 전환 기능', status: 'in-progress', priority: 'medium', createdAt: Date.now() - 250000, updatedAt: Date.now() - 250000, tags: ['UI/UX'] },
    { id: '11', title: '성능 최적화: 이미지', description: '대용량 이미지 Lazy Loading 적용', status: 'todo', priority: 'medium', createdAt: Date.now() - 80000, updatedAt: Date.now() - 80000, tags: ['최적화'] },
    { id: '12', title: 'README 문서 업데이트', description: '설치 방법 및 기여 가이드 작성', status: 'done', priority: 'low', createdAt: Date.now() - 700000, updatedAt: Date.now() - 700000 },
];

export const useTaskStore = create<TasksState>()(
    persist(
        (set) => ({
            tasks: INITIAL_TASKS,
            addTask: (taskData) => set((state) => ({
                tasks: [...state.tasks, { ...taskData, id: uuidv4(), createdAt: Date.now(), updatedAt: Date.now(), order: Date.now() }]
            })),
            moveTask: (id, newStatus) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, status: newStatus, updatedAt: Date.now() } : task
                )
            })),
            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
                )
            })),
            updateTaskOrder: (id, newOrder) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, order: newOrder } : task
                )
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id)
            })),
            toggleFavorite: (id) => set((state) => {
                const task = state.tasks.find((t) => t.id === id);
                if (!task) return state;

                const isFavorite = !task.isFavorite;
                const updatedTask = { ...task, isFavorite };
                // Favorites simply toggle property; sorting handles the rest
                return {
                    tasks: state.tasks.map((t) => t.id === id ? updatedTask : t)
                };
            }),
            clearAllTasks: () => set({ tasks: [] }),
            // Tutorial State
            hasSeenTutorial: false,
            completeTutorial: () => set({ hasSeenTutorial: true }),
            resetTutorial: () => set({ hasSeenTutorial: false }),
            // Dark Mode State
            isDarkMode: false,
            toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        }),
        {
            name: 'task-storage',
            merge: (persistedState, currentState) => {
                const merged = { ...currentState, ...(persistedState as object) } as TasksState;

                // Data Migration: Normalize Status and Priority to lowercase
                if (merged.tasks && Array.isArray(merged.tasks)) {
                    merged.tasks = merged.tasks.map(task => ({
                        ...task,
                        status: (task.status?.toLowerCase() as any) || 'todo',
                        priority: (task.priority?.toLowerCase() as any) || 'medium',
                    }));
                } else {
                    merged.tasks = INITIAL_TASKS;
                }

                return merged;
            },
        }
    )
);
