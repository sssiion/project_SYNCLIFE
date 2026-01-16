
import React, { useState } from 'react';
import { Button, Popconfirm, Switch } from 'antd';
import { Plus, Settings, ChevronRight, ChevronDown, Menu, ArrowLeft, Trash2, Moon } from 'lucide-react';
import StatisticsPanel from './StatisticsPanel';
import SearchBar from './SearchBar';
import { useTaskStore } from '../store/useTaskStore';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { SortOption } from '../types';

interface FloatingSidebarProps {
    onAddTask: () => void;
    onSearch: (query: string) => void;
    onFilterPriority: (priority: string[]) => void;
    onFilterTags: (tags: string[]) => void;
    onFilterDate?: (date: string) => void;

    onFilterFavorite?: (isFav: boolean) => void;
    onSearchScope?: (scope: string) => void;
    onCollapse?: (collapsed: boolean) => void;
    sortOption?: SortOption;
    onSortChange?: (option: SortOption) => void;
}

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({
    onAddTask,
    onSearch,
    onFilterPriority,
    onFilterTags,
    onFilterDate,
    onFilterFavorite,

    onSearchScope,
    onCollapse,
    sortOption,
    onSortChange
}) => {
    // Default to collapsed for the "extracted" view to be initial state
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [view, setView] = useState<'menu' | 'settings'>('menu');
    const isMobile = useMediaQuery('(max-width: 768px)');


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
                            <div style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
                                <SearchBar
                                    simple
                                    onSearch={onSearch}
                                    onFilterPriority={onFilterPriority}
                                    onFilterTags={onFilterTags}
                                    onFilterDate={onFilterDate}
                                    onFilterFavorite={onFilterFavorite}
                                    onSearchScope={onSearchScope}
                                />
                                {sortOption && onSortChange && (
                                    <div style={{ marginTop: '4px', display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', animation: 'fadeIn 0.5s ease-out' }}>
                                        {[
                                            { value: 'priority-asc', label: '중요도(낮은)' },
                                            { value: 'priority-desc', label: '중요도(높은)' },
                                            { value: 'created-desc', label: '최신순' },
                                            { value: 'due-asc', label: '마감일' },
                                            { value: 'manual', label: '자유(직접)' },
                                        ].map((opt) => (
                                            <div
                                                key={opt.value}
                                                // @ts-ignore
                                                onClick={() => onSortChange(opt.value)}
                                                style={{
                                                    fontSize: '10px',
                                                    color: sortOption === opt.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.8)',
                                                    background: sortOption === opt.value ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.2)',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: sortOption === opt.value ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                                    fontWeight: sortOption === opt.value ? 700 : 400,
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    animation: 'slideDown 0.3s ease-out',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <SearchBar
                                    simple
                                    onSearch={onSearch}
                                    onFilterPriority={onFilterPriority}
                                    onFilterTags={onFilterTags}
                                    onFilterDate={onFilterDate}
                                    onFilterFavorite={onFilterFavorite}
                                    onSearchScope={onSearchScope}
                                />
                                {sortOption && onSortChange && (
                                    <div style={{ marginTop: '4px', display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', justifyContent: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                                        {[
                                            { value: 'priority-asc', label: '중요도(낮은)' },
                                            { value: 'priority-desc', label: '중요도(높은)' },
                                            { value: 'created-desc', label: '최신순' },
                                            { value: 'due-asc', label: '마감일' },
                                            { value: 'manual', label: '자유(직접)' },
                                        ].map((opt) => (
                                            <div
                                                key={opt.value}
                                                // @ts-ignore
                                                onClick={() => onSortChange(opt.value)}
                                                style={{
                                                    fontSize: '11px',
                                                    color: sortOption === opt.value ? 'var(--text-primary)' : 'rgba(255,255,255,0.8)',
                                                    background: sortOption === opt.value ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.2)',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: sortOption === opt.value ? 700 : 400,
                                                    backdropFilter: 'blur(4px)'
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                    // Desktop: Floating Banner
                    right: '16px',
                    top: '16px',
                    bottom: '16px',
                    left: 'auto',
                    width: '320px',
                    height: 'calc(100vh - 32px)',
                    // If collapsed, move off-screen (adjust for gap)
                    transform: isCollapsed ? 'translateX(calc(100% + 20px))' : 'translateX(0)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '24px',
                    boxShadow: isCollapsed ? 'none' : '-4px 4px 24px rgba(0, 0, 0, 0.05)',
                }),

                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                boxSizing: 'border-box',
                padding: '0',
                display: 'flex',
                border: 'var(--glass-border)', // Use variable border
                boxShadow: isCollapsed ? 'none' : 'var(--glass-shadow)', // Use variable shadow
                flexDirection: 'column',
                zIndex: 1000,
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s, border 0.3s',
                visibility: isCollapsed ? 'hidden' : 'visible', // Avoid clicks when hidden
            }}>
                {/* Header / Handle Area */}
                <div
                    onClick={isMobile ? toggleSidebar : undefined}
                    style={{
                        padding: '12px 24px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtler border
                        cursor: isMobile ? 'pointer' : 'default',
                        flexShrink: 0,
                        height: '60px',
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr 40px',
                        alignItems: 'center',
                    }}
                >
                    {isMobile && (
                        <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '4px',
                            background: 'rgba(128,128,128,0.3)',
                            borderRadius: '2px',
                        }} />
                    )}

                    {/* Left: Back or Empty */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {view === 'settings' && (
                            <div onClick={(e) => { e.stopPropagation(); handleBackToMenu(); }} style={{ cursor: 'pointer', display: 'flex' }}>
                                <ArrowLeft size={24} color="var(--text-primary)" />
                            </div>
                        )}
                        {/* If in Menu mode and desktop, maybe show nothing or generic icon? Keeping empty to align Title */}
                    </div>

                    {/* Center: Title */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {view === 'menu' ? (
                            <>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    background: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // Keeps brand color
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    color: '#2c3e50', // Brand text always dark on this gradient
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(161, 196, 253, 0.4)',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none'
                                }}>
                                    K
                                </div>
                                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700, userSelect: 'none', WebkitUserSelect: 'none' }}>Task Manager</h2>
                            </>
                        ) : (
                            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>Settings</h2>
                        )}
                    </div>

                    {/* Right: Close or Chevron */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {isMobile ? (
                            <ChevronDown size={24} color="#888" />
                        ) : (
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
                                style={{ cursor: 'pointer', display: 'flex' }}
                            >
                                <ChevronRight size={24} color="#888" />
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
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
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
                                        width: '100%',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none'
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
                                        onFilterDate={onFilterDate}
                                        onFilterFavorite={onFilterFavorite}
                                        onSearchScope={onSearchScope}
                                    />
                                </div>
                            </div>

                            {/* Sorting Controls REMOVED from Expanded View as per user request */}

                            {/* Bottom Actions */}
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Popconfirm
                                    title="Delete All Tasks"
                                    description="Are you sure you want to delete all tasks?"
                                    onConfirm={() => useTaskStore.getState().clearAllTasks()}
                                    okText="Delete"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        danger
                                        type="text"
                                        icon={<Trash2 size={20} />}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'rgba(255, 77, 79, 0.1)',
                                            border: 'none',
                                            color: '#ff4d4f',
                                            borderRadius: '12px'
                                        }}
                                    />
                                </Popconfirm>

                                <Button
                                    type="text"
                                    onClick={handleOpenSettings}
                                    icon={<Settings size={20} />}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(44, 62, 80, 0.05)',
                                        border: 'none',
                                        color: '#2c3e50',
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        // Settings View
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <StatisticsPanel />

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
                                    <span style={{ fontWeight: 600, color: '#2c3e50', userSelect: 'none', WebkitUserSelect: 'none' }}>Dark Mode</span>
                                </div>
                                <Switch
                                    checked={useTaskStore((state) => state.isDarkMode)}
                                    onChange={useTaskStore((state) => state.toggleDarkMode)}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div >
        </>
    );
};

export default FloatingSidebar;
