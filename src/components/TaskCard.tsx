import React from 'react';
import { Card, Tag, Typography, Button, Dropdown, Modal } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';

const { Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    index: number;
    onEditTask: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEditTask }) => {
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

    const handleDelete = () => {
        Modal.confirm({
            title: '삭제',
            content: '태스크를 진짜 삭제하시겠습니까?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteTask(task.id);
            },
        });
    };

    const items = [
        {
            key: 'delete',
            label: 'Delete',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: handleDelete,
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
                        onDoubleClick={() => onEditTask(task)} // Double click to edit
                        variant="borderless"
                        className="glass-panel"
                        hoverable
                        style={{
                            background: task.status === 'DONE' ? 'rgba(235, 235, 235, 0.6)' : 'rgba(255, 255, 255, 0.75)', // Darker for Done
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.8)',
                            boxShadow: snapshot.isDragging
                                ? '0 20px 40px rgba(0,0,0,0.12)'
                                : '0 4px 16px rgba(0,0,0,0.03)',
                            borderRadius: '16px',
                            cursor: 'grab',
                            transition: 'all 0.3s ease',
                        }}
                        styles={{ body: { padding: '16px' } }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <Tag color={getPriorityColor(task.priority)} style={{ borderRadius: '8px', fontWeight: 600, border: 'none' }}>
                                {task.priority}
                            </Tag>
                            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<MoreVertical size={16} />}
                                    style={{ color: 'rgba(0,0,0,0.45)' }}
                                    // Prevent double click on dropdown from triggering edit
                                    onDoubleClick={(e) => e.stopPropagation()}
                                    onClick={(e) => e.stopPropagation()} // Stop click propagation too just in case
                                />
                            </Dropdown>
                        </div>

                        <Paragraph
                            strong
                            style={{ fontSize: '16px', marginBottom: '4px', color: '#2c3e50', margin: 0 }}
                            ellipsis={{ rows: 2, tooltip: task.title }}
                        >
                            {task.title}
                        </Paragraph>

                        {task.description && (
                            <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ fontSize: '13px', color: '#596275', marginBottom: '12px', minHeight: '20px' }}
                            >
                                {task.description}
                            </Paragraph>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 'auto' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#bdc3c7', fontSize: '12px', fontWeight: 500 }}>
                                <Clock size={12} style={{ marginRight: '4px' }} />
                                {task.updatedAt ? (
                                    <span>{formatDate(task.updatedAt)} (수정)</span>
                                ) : (
                                    formatDate(task.createdAt)
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
