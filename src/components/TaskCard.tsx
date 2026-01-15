import React from 'react';
import { Card, Tag, Typography, Button, Dropdown, Modal } from 'antd';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, MoreVertical, Trash2, Edit, Calendar, Star } from 'lucide-react';
import type { Task, TaskStatus } from '../types';
import { useTaskStore } from '../store/useTaskStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    index: number;
    onEditTask: (task: Task) => void;
    searchQuery?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEditTask, searchQuery }) => {
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const toggleFavorite = useTaskStore((state) => state.toggleFavorite);
    const moveTask = useTaskStore((state) => state.moveTask);

    const [isHovered, setIsHovered] = React.useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

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

        const statusFlow: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
        const currentIndex = statusFlow.indexOf(task.status);
        if (currentIndex === -1) return;

        let nextIndex;
        if (direction === 'right') {
            // Right Swipe: Move to Next (TODO -> IN_PROGRESS -> DONE -> TODO Loop)
            // But usually Swipe Right means moving content to the right? 
            // Wait, if I swipe my finger right -> I am pulling content to the right. 
            // This usually reveals left content or goes to "Previous" page visually.
            // But User Requirement: "Task card move right -> InProgress". 
            // Does this mean visually drag it? Or swipe gesture? 
            // "Mobile mode from todo task card right swipe -> move to inprogress"
            // Let's assume standard carousel logic: Swipe LEFT (finger moves right to left) goes to NEXT item. 
            // Swipe RIGHT (finger moves left to right) goes to PREV item.
            // BUT User says: "Task Card Right Swipe -> InProgress".
            // Left Swipe -> Done.
            // Todo is Leftmost. InProgress is Middle. Done is Rightmost.
            // If I am in Todo, and I "Swipe Right" (Finger moves L->R), that feels like pushing it to the Right (In Progress).
            // Let's stick to the direction variable: 'right' means finger went L -> R. 'left' means R -> L.

            // User: "Todo task card right swipe -> InProgress".
            // So distance < 0 (Right Swipe) -> InProgress.

            // Re-reading logic in handleSwipe:
            // current logic: distance = start - end.
            // If start=10, end=100 (Right movement), distance = -90.
            // distance > 0 ? 'left' : 'right'. So -90 is 'right'.

            // Logic check:
            // TODO (Right Swipe) -> IN_PROGRESS.
            // IN_PROGRESS (Right Swipe) -> DONE.
            // DONE (Right Swipe) -> TODO.

            // TODO (Left Swipe) -> DONE.
            // IN_PROGRESS (Left Swipe) -> TODO.
            // DONE (Left Swipe) -> IN_PROGRESS.

            nextIndex = (currentIndex + 1) % statusFlow.length;
        } else {
            // Left Swipe
            nextIndex = (currentIndex - 1 + statusFlow.length) % statusFlow.length;
        }

        const nextStatus = statusFlow[nextIndex];
        moveTask(task.id, nextStatus);
        setIsHovered(false); // Close details on move
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
                        zIndex: snapshot.isDragging ? 9999 : 1,
                        position: snapshot.isDragging ? 'fixed' : 'relative',
                    }}
                    onMouseEnter={() => !isMobile && setIsHovered(true)}
                    onMouseLeave={() => !isMobile && setIsHovered(false)}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                    onClick={handleClick}
                >
                    <Card
                        onDoubleClick={() => onEditTask(task)}
                        variant="borderless"
                        className="glass-panel"
                        hoverable
                        style={{
                            background: task.status === 'DONE' ? 'rgba(235, 235, 235, 0.6)' : 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(20px)',
                            border: isHovered ? '1px solid rgba(142, 197, 252, 0.8)' : '1px solid rgba(255, 255, 255, 0.8)',
                            boxShadow: isHovered || snapshot.isDragging
                                ? '0 20px 40px rgba(0,0,0,0.2)'
                                : '0 4px 16px rgba(0,0,0,0.03)',
                            borderRadius: '16px',
                            cursor: 'grab',
                            minHeight: '100px',
                            transform: isHovered && !snapshot.isDragging ? 'scale(1.05)' : 'none',
                            transition: 'background 0.3s, border 0.3s, box-shadow 0.3s, transform 0.3s',
                            position: 'relative',
                            zIndex: 2,
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
                            style={{ fontSize: '16px', marginBottom: '4px', color: '#2c3e50', margin: 0 }}
                            ellipsis={isHovered ? false : { rows: 2, tooltip: task.title }}
                        >
                            {highlightText(task.title, searchQuery)}
                        </Paragraph>

                        {task.tags && task.tags.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', marginTop: '4px' }}>
                                {task.tags.map(tag => (
                                    <Tag
                                        key={tag}
                                        bordered={false}
                                        style={{
                                            fontSize: '11px',
                                            color: '#7f8c8d',
                                            background: 'rgba(0,0,0,0.04)',
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
                                    style={{ fontSize: '13px', color: '#596275', marginTop: '8px' }}
                                >
                                    {highlightText(task.description, searchQuery)}
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

                            {task.dueDate && task.status !== 'DONE' && (
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
                    </Card>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
