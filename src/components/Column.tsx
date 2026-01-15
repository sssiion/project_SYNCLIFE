import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Typography, Badge } from 'antd';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, color, onEditTask, searchQuery }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
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
                // User Request: Fix width issues on desktop
                width: isMobile ? '100%' : '350px',
                flexShrink: isMobile ? 1 : 0,
                transition: 'all 0.3s ease',
                // User Request: White background when collapsed
                background: (isMobile && isCollapsed) ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                borderRadius: (isMobile && isCollapsed) ? '12px' : '0',
            }}>
            <div
                onClick={toggleCollapse}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    padding: (isMobile && isCollapsed) ? '12px' : '0 8px', // Adjust padding for collapsed state
                    cursor: isMobile ? 'pointer' : 'default',
                    // User Request: Disable text selection (drag feeling)
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', color: '#596275' }}>
                            {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
                        </div>
                    )}
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    <Title level={5} style={{ margin: 0, color: '#2c3e50', fontWeight: 600 }}>
                        {title}
                    </Title>
                    <Badge
                        count={tasks.length}
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            color: '#596275',
                            boxShadow: 'none'
                        }}
                    />
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
