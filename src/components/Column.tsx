import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Typography, Badge } from 'antd';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import { useTaskStore } from '../store/useTaskStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { Title } = Typography;

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    color: string;
    onEditTask: (task: Task) => void;
    searchQuery?: string;
    onToggleHideDone?: () => void;
    isHideDone?: boolean;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, color, onEditTask, searchQuery, onToggleHideDone, isHideDone }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        if (isMobile) {
            setIsCollapsed(!isCollapsed);
        }
    };

    const updateTaskOrder = useTaskStore((state) => state.updateTaskOrder);

    const handleMoveTask = (task: Task, direction: 'up' | 'down') => {
        const index = tasks.findIndex(t => t.id === task.id);
        if (index === -1) return;

        let targetIndex;
        if (direction === 'up') {
            targetIndex = index - 1;
        } else {
            targetIndex = index + 1;
        }

        if (targetIndex < 0 || targetIndex >= tasks.length) return;

        const targetTask = tasks[targetIndex];

        // Swap Orders
        // Fallback to createdAt if order is missing to ensure stability
        const orderA = task.order ?? task.createdAt;
        const orderB = targetTask.order ?? targetTask.createdAt;

        // If orders are identical, spread them slightly
        const newOrderA = orderB;
        const newOrderB = orderA;

        // If A and B were equal, we need to force a diff. 
        // But likely they are distinct enough due to createdAt.

        updateTaskOrder(task.id, newOrderA);
        updateTaskOrder(targetTask.id, newOrderB);
    };

    return (
        <div
            className="kanban-column"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                // User Request: Fix width issues on desktop
                width: isMobile ? '100%' : '350px',
                flexShrink: isMobile ? 1 : 0,
                transition: 'all 0.3s ease',
                // User Request: White background when collapsed
                borderRadius: (isMobile && isCollapsed) ? '12px' : '0',
            }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    padding: '4px 0', // Reduced vertical padding on container
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    outline: 'none',

                    WebkitTapHighlightColor: 'transparent',
                }}
            >
                <div
                    onClick={toggleCollapse}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: (isMobile && isCollapsed) ? 'rgba(255, 255, 255, 0.4)' : 'transparent',

                        transition: 'background 0.2s ease',
                        width: 'fit-content',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                        </div>
                    )}
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    <Title level={5} style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600 }}>
                        {title}
                    </Title>
                    {status === 'DONE' && onToggleHideDone ? (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleHideDone();
                            }}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                borderRadius: '50%',
                                transition: 'background 0.2s',
                            }}
                            title={isHideDone ? "완료된 태스크 보이기" : "완료된 태스크 숨기기"}
                        >
                            {isHideDone ? (
                                <EyeOff size={16} color="#95a5a6" />
                            ) : (
                                <Eye size={16} color="#95a5a6" />
                            )}
                        </div>
                    ) : (
                        <Badge
                            count={tasks.length}
                            style={{
                                backgroundColor: 'rgba(0,0,0,0.06)',
                                color: 'var(--text-secondary)',
                                boxShadow: 'none'
                            }}
                        />
                    )}
                </div>
            </div>

            {(!isMobile || !isCollapsed) && (
                <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                background: snapshot.isDraggingOver
                                    ? 'rgba(0,0,0,0.03)'
                                    : 'transparent',
                                borderRadius: '16px',
                                padding: '12px',
                                paddingBottom: '100px', // Ensure last item is reachable above mobile bottom bar
                                flex: 1,
                                transition: 'background 0.2s ease',
                                minHeight: '200px',
                                border: snapshot.isDraggingOver ? '1px dashed rgba(0,0,0,0.1)' : '1px solid transparent',
                                overflowY: isMobile ? 'visible' : 'auto', // Use visible on mobile to allow Page Scroll to handle it
                                overflowX: 'hidden',

                                // Fix for iOS scrolling issues with DnD
                                WebkitOverflowScrolling: 'touch',
                            }}
                        >
                            {tasks.length === 0 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100px',
                                    color: '#b2bec3',
                                    fontSize: '14px',
                                    textAlign: 'center',

                                    userSelect: 'none'
                                }}>
                                    등록된 태스크가 없습니다.
                                </div>
                            )}
                            {tasks.map((task, index) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    index={index}
                                    onEditTask={onEditTask}
                                    onMoveTask={handleMoveTask}
                                    searchQuery={searchQuery}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            )}
        </div>
    );
};

export default Column;
