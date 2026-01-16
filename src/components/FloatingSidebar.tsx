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

    // Fix: Hooks must be at top level
    const isDarkMode = useTaskStore((state) => state.isDarkMode);
    const toggleDarkMode = useTaskStore((state) => state.toggleDarkMode);

    // Global Shortcuts ('M', 'N', 'S')
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if input/textarea is focused
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement ||
                (document.activeElement as HTMLElement).isContentEditable
            ) {
                return;
            }

            // 'M' - Toggle Menu
            if (e.key.toLowerCase() === 'm') {
                const newState = !isCollapsed;
                setIsCollapsed(newState);
                if (onCollapse) {
                    onCollapse(newState);
                }
            }

            // 'N' - New Task
            if (e.key.toLowerCase() === 'n') {
                e.preventDefault();
                onAddTask();
            }

            // 'S' - Focus Search
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                const searchInput = document.getElementById('global-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isCollapsed, onCollapse, onAddTask]);

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        if (onCollapse) {
            onCollapse(newState);
        }
    };

    // Click outside to close sidebar
    React.useEffect(() => {
        if (isCollapsed) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if click is outside the sidebar content
            const sidebarContent = document.querySelector('[data-sidebar-content]');
            const extractedToolbar = document.querySelector('[data-extracted-toolbar]');

            if (sidebarContent && !sidebarContent.contains(target)) {
                // If toolbar exists (it shouldn't when open, but just in case), check it too
                if (extractedToolbar && extractedToolbar.contains(target)) {
                    return;
                }
                toggleSidebar();
            }
        };

        // Small delay to prevent immediate closure when opening
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCollapsed]);

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
                            data-extracted-toolbar
                            style={{
                                position: 'fixed',
                                top: '24px',
                                right: '24px',
                                zIndex: 1002,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                transition: 'all 0.3s ease',
                                animation: 'fadeIn 0.3s ease-out'
                            }}
                        >
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
                                                onClick={() => onSortChange(opt.value as SortOption)}
                                                style={{
                                                    fontSize: '10px',
                                                    color: sortOption === opt.value ? '#021859' : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'),
                                                    background: sortOption === opt.value ? (isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)') : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    boxShadow: sortOption === opt.value ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                                                    fontWeight: sortOption === opt.value ? 700 : 400,
                                                    userSelect: 'none',
                                                    WebkitUserSelect: 'none'
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                id="ui-add-btn"
                                onClick={onAddTask}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: isDarkMode
                                        ? 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)'
                                        : 'linear-gradient(135deg, #07D950 0%, #021859 100%)',
                                    color: 'var(--text-white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: isDarkMode
                                        ? '0 4px 12px rgba(72, 52, 212, 0.3)'
                                        : '0 4px 12px rgba(118, 75, 162, 0.3)'
                                }}>
                                <Plus size={20} />
                            </div>

                            <div
                                id="ui-menu-btn"
                                onClick={toggleSidebar}
                                style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(8px)',
                                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255,255,255,0.6)',
                                    color: isDarkMode ? 'var(--text-primary)' : '#021859',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}>
                                <Menu size={20} />
                            </div>
                        </div>
                    )}

                    {/* Mobile Layout: Split */}
                    {isMobile && (
                        <div
                            data-extracted-toolbar
                            style={{
                                position: 'fixed',
                                top: '12px',
                                left: '28px',
                                right: '28px',
                                zIndex: 1002,
                                animation: 'slideDown 0.3s ease-out',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none', justifyContent: 'center', animation: 'fadeIn 0.5s ease-out' }}>
                                            {[
                                                { value: 'priority-asc', label: '중요도(낮은)' },
                                                { value: 'priority-desc', label: '중요도(높은)' },
                                                { value: 'created-desc', label: '최신순' },
                                                { value: 'due-asc', label: '마감일' },
                                                { value: 'manual', label: '자유(직접)' },
                                            ].map((opt) => (
                                                <div
                                                    key={opt.value}
                                                    onClick={() => onSortChange(opt.value as SortOption)}
                                                    style={{
                                                        fontSize: '11px',
                                                        color: sortOption === opt.value ? '#021859' : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.6)'),
                                                        background: sortOption === opt.value ? (isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)') : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        whiteSpace: 'nowrap',
                                                        fontWeight: sortOption === opt.value ? 700 : 400,
                                                        backdropFilter: 'blur(4px)',
                                                        userSelect: 'none',
                                                        WebkitUserSelect: 'none'
                                                    }}
                                                >
                                                    {opt.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div
                                    id="ui-menu-btn"
                                    onClick={toggleSidebar}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                                        backdropFilter: 'blur(10px)',
                                        color: isDarkMode ? 'var(--text-primary)' : '#021859',
                                        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', flexShrink: 0,
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                    }}>
                                    <Menu size={20} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }

            {/* Sidebar Content */}
            <div data-sidebar-content style={{
                position: 'fixed',
                ...(isMobile ? {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100vw',
                    maxWidth: '100%',
                    height: '85vh',
                    transform: isCollapsed ? 'translateY(100%)' : 'translateY(0)',
                    borderRadius: '24px 24px 0 0',
                    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.1)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.5)',
                } : {
                    right: '16px',
                    top: '16px',
                    bottom: '16px',
                    left: 'auto',
                    width: '320px',
                    height: 'calc(100vh - 32px)',
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
                flexDirection: 'column',
                zIndex: 1000,
                transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.3s, border 0.3s',
                visibility: isCollapsed ? 'hidden' : 'visible',
            }}>
                {/* Header */}
                <div
                    onClick={isMobile ? toggleSidebar : undefined}
                    style={{
                        padding: '12px 24px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                        {view === 'settings' && (
                            <div onClick={(e) => { e.stopPropagation(); handleBackToMenu(); }} style={{ cursor: 'pointer', display: 'flex' }}>
                                <ArrowLeft size={24} color="var(--text-primary)" />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {view === 'menu' ? (
                            <>

                                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700, userSelect: 'none', WebkitUserSelect: 'none', opacity: '0.5' }}>Task Manager</h2>
                            </>
                        ) : (
                            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)', fontWeight: 700 }}>Settings</h2>
                        )}
                    </div>

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

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                }}>
                    {view === 'menu' ? (
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Button
                                    type="primary"
                                    onClick={onAddTask}
                                    icon={<Plus size={18} />}
                                    size="large"
                                    style={{
                                        background: isDarkMode
                                            ? 'rgba(255, 255, 255, 0.15)'
                                            : 'linear-gradient(135deg, #07D950 0%, #021859 100%)',
                                        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        boxShadow: isDarkMode ? 'none' : '0 4px 14px 0 rgba(118, 75, 162, 0.39)',
                                        height: '40px',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        width: '100%',
                                        color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : '#fff',
                                        userSelect: 'none',
                                        WebkitUserSelect: 'none'
                                    }}
                                >
                                    Add New Task
                                </Button>
                            </div>

                            <div style={{
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.4)',
                                borderRadius: '16px',
                                padding: '16px',
                                border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(255, 255, 255, 0.4)'
                            }}>
                                <SearchBar
                                    onSearch={onSearch}
                                    onFilterPriority={onFilterPriority}
                                    onFilterTags={onFilterTags}
                                    onFilterDate={onFilterDate}
                                    onFilterFavorite={onFilterFavorite}
                                    onSearchScope={onSearchScope}
                                />
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Popconfirm
                                    title="Delete All Tasks"
                                    description="Are you sure you want to delete all tasks?"
                                    onConfirm={() => useTaskStore.getState().clearAllTasks()}
                                    okText="Delete"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        id="ui-delete-all-btn"
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
                                    id="ui-settings-btn"
                                    type="text"
                                    onClick={handleOpenSettings}
                                    icon={<Settings size={20} />}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(44, 62, 80, 0.05)',
                                        border: 'none',
                                        color: isDarkMode ? 'var(--text-primary)' : '#021859',
                                        borderRadius: '12px'
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <StatisticsPanel />

                            <div style={{
                                background: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255,255,255,0.5)',
                                borderRadius: '16px',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ecf0f1', borderRadius: '8px' }}>
                                        <Moon size={18} color={isDarkMode ? "var(--text-primary)" : "#2d3436"} />
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', userSelect: 'none', WebkitUserSelect: 'none' }}>Dark Mode</span>
                                </div>
                                <Switch
                                    checked={isDarkMode}
                                    onChange={toggleDarkMode}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                />
                            </div>

                            <div
                                onClick={() => {
                                    useTaskStore.getState().resetTutorial();
                                }}
                                style={{
                                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ padding: '8px', background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#ecf0f1', borderRadius: '8px' }}>
                                        <div style={{ fontWeight: 'bold', color: isDarkMode ? 'var(--text-secondary)' : '#636e72' }}>?</div>
                                    </div>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', userSelect: 'none', WebkitUserSelect: 'none' }}>App Guide</span>
                                </div>
                                <div style={{ fontSize: '12px', color: isDarkMode ? 'var(--text-secondary)' : '#636e72', background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '8px' }}>
                                    View Again
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                isMobile && isCollapsed && (
                    <div
                        id="ui-add-fab"
                        onClick={onAddTask}
                        className="pulse-animation"
                        style={{
                            position: 'fixed',
                            bottom: '32px',
                            right: '32px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '30px',
                            background: isDarkMode
                                ? 'linear-gradient(135deg, #4834d4 0%, #686de0 100%)'
                                : 'linear-gradient(135deg, #07D950 0%, #021859 100%)',
                            color: 'var(--text-white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 1001,
                            boxShadow: '0 8px 24px rgba(108, 92, 231, 0.4)',
                            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Plus size={30} strokeWidth={3} />
                    </div>
                )
            }
        </>
    );
};

export default FloatingSidebar;
