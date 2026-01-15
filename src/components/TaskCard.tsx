import React from 'react';
import { Card, Tag, Typography, Button, Dropdown, Modal } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical, Trash2, Edit, Calendar } from 'lucide-react';
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
    const [isHovered, setIsHovered] = React.useState(false);

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
            title: '삭제하기',
            content: '정말로 이 태스크를 삭제하시겠습니까?',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk() {
                deleteTask(task.id);
            },
        });
    };

    const items = [
        {
            key: 'edit',
            label: '수정하기',
            icon: <Edit size={14} />,
            onClick: () => onEditTask(task),
        },
        {
            key: 'delete',
            label: '삭제하기',
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: handleDelete,
        },
    ];

    const getDDay = (dueDate: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays < 0) return `D+${Math.abs(diffDays)}`;
        return `D-${diffDays}`;
    };

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
                        // Combine drag transform with hover scale if not dragging
                        transform: snapshot.isDragging
                            ? provided.draggableProps.style?.transform
                            : isHovered
                                ? 'scale(1.05)'
                                : provided.draggableProps.style?.transform,
                        zIndex: isHovered && !snapshot.isDragging ? 100 : 1, // Bring to front on hover
                        transition: snapshot.isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)', // Smooth transition
                        position: 'relative', // Context for z-index
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Card
                        onDoubleClick={() => onEditTask(task)} // Double click to edit
                        variant="borderless"
                        className="glass-panel"
                        hoverable
                        style={{
                            background: task.status === 'DONE' ? 'rgba(235, 235, 235, 0.6)' : 'rgba(255, 255, 255, 0.75)', // Darker for Done
                            backdropFilter: 'blur(20px)',
                            border: isHovered ? '1px solid rgba(142, 197, 252, 0.8)' : '1px solid rgba(255, 255, 255, 0.8)', // Highlight border on hover
                            boxShadow: isHovered || snapshot.isDragging
                                ? '0 20px 40px rgba(0,0,0,0.2)'
                                : '0 4px 16px rgba(0,0,0,0.03)',
                            borderRadius: '16px',
                            cursor: 'grab',
                            minHeight: '100px', // Prevent jumpiness
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
                            ellipsis={isHovered ? false : { rows: 2, tooltip: task.title }} // Expand title on hover if needed
                        >
                            {task.title}
                        </Paragraph>

                        {/* Description only visible on hover */}
                        <div style={{
                            maxHeight: isHovered ? '200px' : '0px',
                            overflow: 'hidden',
                            opacity: isHovered ? 1 : 0,
                            transition: 'all 0.3s ease',
                            marginBottom: isHovered ? '12px' : '0px'
                        }}>
                            {task.description && (
                                <Paragraph
                                    style={{ fontSize: '13px', color: '#596275', marginTop: '8px' }}
                                >
                                    {task.description}
                                </Paragraph>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: isHovered ? '0' : '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: '#bdc3c7', fontSize: '12px', fontWeight: 500 }}>
                                <Clock size={12} style={{ marginRight: '4px' }} />
                                {task.updatedAt ? (
                                    <span>{formatDate(task.updatedAt)} (수정)</span>
                                ) : (
                                    formatDate(task.createdAt)
                                )}
                            </div>

                            {task.dueDate && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: task.dueDate < Date.now() && task.status !== 'DONE' ? '#ff4d4f' : '#8c8c8c',
                                    fontWeight: isHovered ? 400 : 700
                                }}>
                                    <Calendar size={12} style={{ marginRight: '4px' }} />
                                    <span>{isHovered ? formatDate(task.dueDate) : getDDay(task.dueDate)}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
