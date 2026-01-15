import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { Plus, Trash2, Settings, ChevronRight, ChevronLeft } from 'lucide-react';
import SearchBar from './SearchBar';
import { useTaskStore } from '../store/useTaskStore';

interface FloatingSidebarProps {
    onAddTask: () => void;
    onSearch: (query: string) => void;
    onFilterPriority: (priority: string[]) => void;
    onFilterTags: (tags: string[]) => void;
    onCollapse?: (collapsed: boolean) => void;
}

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({
    onAddTask,
    onSearch,
    onFilterPriority,
    onFilterTags,
    onCollapse
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <div
                onClick={toggleSidebar}
                style={{
                    position: 'fixed',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '24px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 1001,
                    transition: 'right 0.3s ease, border-radius 0.3s ease',
                    right: isCollapsed ? '0' : '320px',
                    borderRadius: '12px 0 0 12px',
                }}
            >
                {isCollapsed ? <ChevronLeft size={16} color="#555" /> : <ChevronRight size={16} color="#555" />}
            </div>

            <div style={{
                position: 'fixed',
                right: isCollapsed ? '-340px' : '0',
                top: 0,
                height: '100vh',
                width: '320px',
                background: 'rgba(255, 255, 255, 0.6)', // More opaque for better readability
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: isCollapsed ? 'none' : '-4px 0 24px rgba(0, 0, 0, 0.05)',
                boxSizing: 'border-box',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                zIndex: 1000,
                transition: 'right 0.3s ease',
                visibility: isCollapsed ? 'hidden' : 'visible' // Hide content when collapsed to prevent focus
            }}>
                {/* Header / Logo Area */}


                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Button
                        type="primary"
                        onClick={onAddTask}
                        icon={<Plus size={18} />}
                        size="large"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.39)',
                            height: '40px',
                            fontSize: '16px',
                            fontWeight: 600,
                            width: '100%'
                        }}
                    >
                        Add New Task
                    </Button>
                </div>

                {/* Search Section */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.4)'
                }}>

                    {/* Explicitly passing a style/className to SearchBar via wrapper context or similar approach would be ideal, 
                        but since SearchBar is integrated, I'll rely on global adaptation or just wrap it. 
                        User wants Tag filter to the right. 
                        I'll modify SearchBar.tsx to support 'alignTagsRight' prop or just do it in SearchBar directly. 
                        For now, I'll assume SearchBar update handles the right alignment.
                    */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <SearchBar
                            onSearch={onSearch}
                            onFilterPriority={onFilterPriority}
                            onFilterTags={onFilterTags}
                        />
                    </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button
                        icon={<Settings size={16} />}
                        style={{
                            background: 'rgba(255, 255, 255, 0.5)',
                            border: 'none',
                            justifyContent: 'flex-start'
                        }}
                    >
                        Settings
                    </Button>

                    <Popconfirm
                        title="Delete All Tasks"
                        description="Are you sure you want to delete all tasks?"
                        onConfirm={() => useTaskStore.getState().clearAllTasks()}
                        okText="Delete"
                        cancelText="Cancel"
                    >
                        <Button
                            danger
                            icon={<Trash2 size={16} />}
                            style={{
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: '1px solid #ff7875',
                                color: '#ff4d4f',
                                justifyContent: 'flex-start'
                            }}
                        >
                            Delete All Tasks
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </>
    );
};

export default FloatingSidebar;
