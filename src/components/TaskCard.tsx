import React from 'react';
import { Card, Tag, Typography, Button, Dropdown } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';

const { Text, Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
    const deleteTask = useTaskStore((state) => state.deleteTask);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
        });
    };

    const items = [
        {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => deleteTask(task.id),
        },
    ];

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        marginBottom: '16px',
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging ?
                            `${provided.draggableProps.style?.transform} scale(1.05)` :
                            provided.draggableProps.style?.transform,
                    }}
                >
                    <Card
                        bordered={false}
                        className="glass-panel"
                        hoverable
                        style={{
                            background: 'rgba(255, 255, 255, 0.45)', // Slightly more opaque for cards
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            boxShadow: snapshot.isDragging
                                ? '0 20px 40px rgba(0,0,0,0.2)'
                                : '0 4px 16px rgba(0,0,0,0.05)',
                            borderRadius: '12px',
                            cursor: 'grab',
                            transition: 'all 0.3s ease',
                        }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <Tag color={getPriorityColor(task.priority)} style={{ borderRadius: '10px', fontWeight: 600, border: 'none' }}>
                                {task.priority}
                            </Tag>
                            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MoreVertical size={16} />}
                                    style={{ color: 'rgba(0,0,0,0.45)' }}
                                />
                            </Dropdown>
                        </div>

                        <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '4px', color: '#1f1f1f' }}>
                            {task.title}
                        </Text>

                        {task.description && (
                            <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '12px', minHeight: '20px' }}
                            >
                                {task.description}
                            </Paragraph>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(0,0,0,0.4)', fontSize: '12px' }}>
                                <Clock size={12} style={{ marginRight: '4px' }} />
                                {formatDate(task.createdAt)}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
