import React, { useState, useMemo } from 'react';
import { Button, Popconfirm, Switch, Statistic, Row, Col } from 'antd';
import { Plus, Trash2, Settings, ChevronRight, ChevronDown, ArrowLeft, Moon, Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import { useTaskStore } from '../store/useTaskStore';
import { useMediaQuery } from '../hooks/useMediaQuery';

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
    // Default to collapsed for the "extracted" view to be initial state
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [view, setView] = useState<'menu' | 'settings'>('menu');
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Task Stats
    const tasks = useTaskStore((state) => state.tasks);
    const stats = useMemo(() => {
        const total = tasks.length;
        const todo = tasks.filter(t => t.status === 'TODO').length;
        const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const done = tasks.filter(t => t.status === 'DONE').length;
        const high = tasks.filter(t => t.priority === 'HIGH').length;
        return { total, todo, inProgress, done, high };
    }, [tasks]);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    const handleOpenSettings = () => {
        setView('settings');
    };

    const handleBackToMenu = () => {
        setView('menu');
    };

    return (
        <>
            {/* Extracted Toolbar - Visible ONLY when Collapsed */}
            {isCollapsed && (
                <>
                    {/* Desktop Layout: All Top Right, Row */}
                    {!isMobile && (
                        <div
                            style={{
                                position: 'fixed',
                                top: '24px',
                                right: '24px',
                                zIndex: 1002,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                animation: 'fadeIn 0.3s ease-out'
                            }}
                        >
                            {/* Simplified Search Bar */}
                            <div style={{ width: '300px' }}>
                                <SearchBar
                                    simple
                                    onSearch={onSearch}
                                    onFilterPriority={onFilterPriority}
                                    onFilterTags={onFilterTags}
                                />
                            </div>

                            <div onClick={onAddTask} style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)'
                            }}>
                                <Plus size={20} />
                            </div>

                            <div onClick={toggleSidebar} style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)',
                                border: '1px solid rgba(255,255,255,0.6)', color: '#2c3e50',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                <Menu size={20} />
                            </div>
                        </div>
                    )}

                    {/* Mobile Layout: Split */}
                    {isMobile && (
                        <>
                            {/* Top: Search Bar */}
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '12px',
                                    left: '16px',
                                    right: '16px',
                                    zIndex: 1002,
                                    animation: 'slideDown 0.3s ease-out'
                                }}
                            >
                                <SearchBar
                                    simple
                                    onSearch={onSearch}
                                    onFilterPriority={onFilterPriority}
                                    onFilterTags={onFilterTags}
                                />
                            </div>

                            {/* Bottom: Buttons (FAB style) */}
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: '24px',
                                    right: '16px',
                                    zIndex: 1002,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    animation: 'slideUp 0.3s ease-out'
                                }}
                            >
                                <div onClick={onAddTask} style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(118, 75, 162, 0.4)'
                                }}>
                                    <Plus size={24} />
                                </div>
                                <div onClick={toggleSidebar} style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
                                    color: '#2c3e50', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                }}>
                                    <Menu size={20} />
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Sidebar Content - Hidden/Peek behavior modified */}
            {/* When collapsed, we now hide it completely because we use the extracted toolbar */}
            <div style={{
                position: 'fixed',
                ...(isMobile ? {
                    // Mobile: Bottom Sheet
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100vw',
                    maxWidth: '100%',
                    // If collapsed, hide completely (below screen)
                    height: '85vh',
                    transform: isCollapsed ? 'translateY(100%)' : 'translateY(0)',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.1)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.5)',
                } : {
                    // Desktop: Side Drawer
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: 'auto',
                    width: '320px',
                    height: '100vh',
                    // If collapsed, move off-screen tight
                    transform: isCollapsed ? 'translateX(100%)' : 'translateX(0)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '0',
                    boxShadow: isCollapsed ? 'none' : '-4px 0 24px rgba(0, 0, 0, 0.05)',
                }),

                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                visibility: isCollapsed ? 'hidden' : 'visible', // Avoid clicks when hidden
            }}>
                {/* Header / Handle Area */}
                <div
                    onClick={isMobile ? toggleSidebar : undefined}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '12px 24px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                        cursor: isMobile ? 'pointer' : 'default',
                        flexShrink: 0,
                        height: '60px',
                        justifyContent: 'center'
                    }}
                >
                    {isMobile && (
                        <div style={{
                            width: '40px',
                            height: '4px',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '2px',
                            marginBottom: '8px'
                        }} />
                    )}

                    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {view === 'settings' && (
                            <div onClick={(e) => { e.stopPropagation(); handleBackToMenu(); }} style={{ cursor: 'pointer', marginRight: '8px' }}>
                                <ArrowLeft size={20} color="#2c3e50" />
                            </div>
                        )}

                        {view === 'menu' ? (
                            <>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(161, 196, 253, 0.4)'
                                }}>
                                    K
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '16px', color: '#2c3e50', fontWeight: 700 }}>Task Manager</h2>
                                </div>
                            </>
                        ) : (
                            <h2 style={{ margin: 0, fontSize: '16px', color: '#2c3e50', fontWeight: 700 }}>Settings</h2>
                        )}

                        {isMobile && (
                            <div style={{ marginLeft: 'auto', color: '#888' }}>
                                <ChevronDown size={20} />
                            </div>
                        )}
                        {!isMobile && (
                            // Close button for Desktop inside the drawer since external toggle is gone
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
                                style={{ marginLeft: 'auto', cursor: 'pointer', color: '#888' }}
                            >
                                <ChevronRight size={20} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    // No need for separate opacity transition since the whole container moves
                }}>
                    {view === 'menu' ? (
                        <>
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <SearchBar
                                        onSearch={onSearch}
                                        onFilterPriority={onFilterPriority}
                                        onFilterTags={onFilterTags}
                                    />
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button
                                    onClick={handleOpenSettings}
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
                        </>
                    ) : (
                        // Settings View
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Stats */}
                            <div style={{
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '16px',
                                padding: '16px'
                            }}>
                                <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '14px', color: '#596275' }}>Task Statistics</h3>
                                <Row gutter={[16, 16]}>
                                    <Col span={12}>
                                        <Statistic title="Total" value={stats.total} />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic title="High Priority" value={stats.high} valueStyle={{ color: '#ff7675' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Todo" value={stats.todo} valueStyle={{ fontSize: '16px' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Active" value={stats.inProgress} valueStyle={{ fontSize: '16px', color: '#0984e3' }} />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic title="Done" value={stats.done} valueStyle={{ fontSize: '16px', color: '#00b894' }} />
                                    </Col>
                                </Row>
                            </div>

                            {/* Appearance */}
                            <div style={{
                                background: 'rgba(255,255,255,0.5)',
                                borderRadius: '16px',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px', background: '#ecf0f1', borderRadius: '8px' }}>
                                        <Moon size={18} color="#2d3436" />
                                    </div>
                                    <span style={{ fontWeight: 600, color: '#2c3e50' }}>Dark Mode</span>
                                </div>
                                <Switch checkedChildren="ON" unCheckedChildren="OFF" disabled title="Coming Soon" />
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default FloatingSidebar;
