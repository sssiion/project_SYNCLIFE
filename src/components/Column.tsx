import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Typography, Badge } from 'antd';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

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
    const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1200px)');
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        if (isMobile) {
            setIsCollapsed(!isCollapsed);
        }
    };





    return (
        <div
            className="kanban-column"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                // User Request: Fix width issues on desktop/tablet
                width: isMobile ? '100%' : (isTablet ? 'auto' : '350px'),
                flex: isMobile ? 'none' : (isTablet ? '1 1 0' : '0 0 350px'),
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
                    {status === 'done' && onToggleHideDone ? (
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
