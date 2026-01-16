import React from 'react';
import { Card, Tag, Typography, Button, Dropdown, Modal } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical, Trash2, Edit, Calendar, Star } from 'lucide-react';
import type { Task } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { Paragraph } = Typography;
import { X } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    index: number;
    onEditTask: (task: Task) => void;
    onMoveTask?: (task: Task, direction: 'up' | 'down') => void;
    searchQuery?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEditTask, onMoveTask, searchQuery }) => {
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const toggleFavorite = useTaskStore((state) => state.toggleFavorite);

    const [isHovered, setIsHovered] = React.useState(false);
    const [isReordering, setIsReordering] = React.useState(false);
    const isMobile = useMediaQuery('(max-width: 1024px)');

    // Highlight Text Helper
    const highlightText = (text: string, query?: string) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase() ? (
                        <span key={i} style={{ backgroundColor: '#fff700', borderRadius: '2px', color: 'black' }}>{part}</span>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    // Swipe Logic State
    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const minSwipeDistance = 50;

    // Helper Functions
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
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

    // Swipe Handlers
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
        const isSwipe = Math.abs(distance) > minSwipeDistance;

        if (isSwipe) {
            // Swipe Left (distance > 0) or Right (distance < 0)
            const direction = distance > 0 ? 'left' : 'right';
            handleSwipe(direction);
        }
        setTouchStart(null);
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (!isMobile) return;

        if (direction === 'right') {
            // Right Swipe (Left -> Right): Edit
            onEditTask(task);
            // Optionally close swipe state if we had one, or visual feedback
        } else {
            // Left Swipe (Right -> Left): Delete
            handleDelete();
        }
        setIsHovered(false);
    };

    const handleClick = () => {
        if (isMobile) {
            setIsHovered(!isHovered);
        }
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

    // D-Day Logic and Styling State
    let diffDays = 0;
    if (task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - today.getTime();
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const isUrgent = task.status !== 'done' && task.dueDate && diffDays <= 1;
    const isDone = task.status === 'done';

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
                        outline: 'none',
                        // Maintain original z-index logic
                        zIndex: snapshot.isDragging ? 9999 : 1,
                        // CRITICAL: Allow native browser scrolling (pan-y)
                        touchAction: 'manipulation',
                    }}
                    onMouseEnter={() => !isMobile && setIsHovered(true)}
                    onMouseLeave={() => !isMobile && setIsHovered(false)}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={handleClick}
                    onDoubleClick={() => setIsReordering(true)}
                >
                    <Card
                        className={`glass-panel task-card-inner ${snapshot.isDragging ? 'is-dragging' : ''}`}
                        style={{
                            // Inner Card Styles
                            cursor: 'grab', // Restore grab cursor
                            border: snapshot.isDragging ? '1px solid #74b9ff' : 'var(--card-border)',
                            // Conditional Background Logic
                            background: isDone
                                ? 'var(--card-bg-done)'
                                : isUrgent
                                    ? 'var(--card-bg-urgent)'
                                    : 'var(--card-bg)',
                            // Shadow is handled by CSS now for hover, but kept for drag/static for specific states if needed
                            // We can let CSS handle hover shadow override.
                            boxShadow: snapshot.isDragging
                                ? '0 20px 40px rgba(116, 185, 255, 0.4)'
                                : '0 4px 12px rgba(0,0,0,0.02)', // Base shadow
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                        }}
                        styles={{ body: { padding: '16px' } }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <Tag color={getPriorityColor(task.priority)} style={{ borderRadius: '8px', fontWeight: 600, border: 'none' }}>
                                {task.priority}
                            </Tag>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    type="text"
                                    size="small"
                                    icon={
                                        <Star
                                            size={16}
                                            fill={task.isFavorite ? "#f1c40f" : "transparent"}
                                            color={task.isFavorite ? "#f1c40f" : "#bdc3c7"}
                                        />
                                    }
                                    style={{ marginRight: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(task.id);
                                    }}
                                />
                                <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<MoreVertical size={16} />}
                                        style={{ color: 'rgba(0,0,0,0.45)' }}
                                        onDoubleClick={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Dropdown>
                            </div>
                        </div>

                        <Paragraph
                            strong
                            style={{ fontSize: '16px', marginBottom: '4px', marginTop: 0, color: 'var(--text-primary)' }}
                            ellipsis={isHovered ? false : { rows: 2, tooltip: task.title }}
                        >
                            {highlightText(task.title, searchQuery)}
                        </Paragraph>

                        {task.tags && task.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', marginTop: '4px' }}>
                                {task.tags.map(tag => (
                                    <Tag
                                        key={tag}
                                        style={{
                                            fontSize: '11px',
                                            color: 'var(--tag-text)',
                                            background: 'var(--tag-bg)',
                                            borderRadius: '4px',
                                            margin: 0,
                                            padding: '0 6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            lineHeight: '18px'
                                        }}
                                    >
                                        #{highlightText(tag, searchQuery)}
                                    </Tag>
                                ))}
                            </div>
                        )}

                        <div style={{
                            maxHeight: isHovered ? '200px' : '0px',
                            overflow: 'hidden',
                            opacity: isHovered ? 1 : 0,
                            transition: 'all 0.3s ease',
                            marginBottom: isHovered ? '12px' : '0px'
                        }}>
                            {task.description && (
                                <Paragraph
                                    style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}
                                >
                                    {highlightText(task.description, searchQuery)}
                                </Paragraph>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: isHovered ? '0' : '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 500 }}>
                                <Clock size={12} style={{ marginRight: '4px' }} />
                                {task.updatedAt ? (
                                    <span>{formatDate(task.updatedAt)} (수정)</span>
                                ) : (
                                    formatDate(task.createdAt)
                                )}
                            </div>

                            {task.dueDate && task.status !== 'done' && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: task.dueDate < Date.now() ? '#ff4d4f' : '#8c8c8c',
                                    fontWeight: isHovered ? 400 : 700
                                }}>
                                    <Calendar size={12} style={{ marginRight: '4px' }} />
                                    <span>{isHovered ? formatDate(task.dueDate) : getDDay(task.dueDate)}</span>
                                </div>
                            )}
                        </div>

                        {/* Quick Move Overlay (Double Click/Tap) */}
                        {isReordering && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 10,
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(4px)',
                                    animation: 'fadeIn 0.2s ease-out'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#2d3436', marginBottom: '12px' }}>
                                    어디로 이동할까요?
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                    {task.status !== 'todo' && (
                                        <Button
                                            type="default"
                                            shape="round"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const moveTask = useTaskStore.getState().moveTask;
                                                moveTask(task.id, 'todo');
                                                setIsReordering(false);
                                            }}
                                            style={{ borderColor: 'var(--col-todo)', color: 'var(--col-todo)', fontWeight: 600 }}
                                        >
                                            To Do
                                        </Button>
                                    )}
                                    {task.status !== 'in-progress' && (
                                        <Button
                                            type="default"
                                            shape="round"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const moveTask = useTaskStore.getState().moveTask;
                                                moveTask(task.id, 'in-progress');
                                                setIsReordering(false);
                                            }}
                                            style={{ borderColor: 'var(--col-progress)', color: 'var(--col-progress)', fontWeight: 600 }}
                                        >
                                            In Prog
                                        </Button>
                                    )}
                                    {task.status !== 'done' && (
                                        <Button
                                            type="default"
                                            shape="round"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const moveTask = useTaskStore.getState().moveTask;
                                                moveTask(task.id, 'done');
                                                setIsReordering(false);
                                            }}
                                            style={{ borderColor: 'var(--col-done)', color: 'var(--col-done)', fontWeight: 600 }}
                                        >
                                            Done
                                        </Button>
                                    )}
                                </div>
                                <Button
                                    type="text"
                                    icon={<X size={20} />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsReordering(false);
                                    }}
                                    style={{ color: '#596275' }}
                                >
                                    닫기
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
