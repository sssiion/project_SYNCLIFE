import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Typography, Badge } from 'antd';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

const { Title } = Typography;

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    color: string;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, color }) => {
    return (
        <div
            className="kanban-column"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minWidth: '320px',
                maxWidth: '350px',
                flexShrink: 0,
                transition: 'all 0.3s ease'
            }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                padding: '0 8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />
                    <Title level={5} style={{ margin: 0, color: 'white', fontWeight: 600 }}>
                        {title}
                    </Title>
                    <Badge
                        count={tasks.length}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            boxShadow: 'none'
                        }}
                    />
                </div>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                            background: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent',
                            borderRadius: '16px',
                            padding: '12px',
                            flex: 1,
                            transition: 'background 0.2s ease',
                            minHeight: '200px',
                            border: snapshot.isDraggingOver ? '1px dashed rgba(255,255,255,0.3)' : '1px solid transparent'
                        }}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
