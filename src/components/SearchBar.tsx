import React, { useState, useEffect } from 'react';
import { Input, Select, Tag } from 'antd';
import { Search, X, Star } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';

const { Option } = Select;

export interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterPriority: (priority: string[]) => void;
    onFilterTags?: (tags: string[]) => void;
    onFilterDate?: (date: string) => void;
    onFilterFavorite?: (isFav: boolean) => void;
    onSearchScope?: (scope: string) => void;
    simple?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterPriority, onFilterTags, onFilterDate, onFilterFavorite, onSearchScope, simple }) => {
    const [isFavActive, setIsFavActive] = useState(false);
    const tasks = useTaskStore((state) => state.tasks);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(inputValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, onSearch]);

    const saveSearch = (term: string) => {
        if (!term.trim()) return;
        const newHistory = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
        setRecentSearches(newHistory);
        localStorage.setItem('recentSearches', JSON.stringify(newHistory));
    };

    const handleDelete = (term: string) => {
        const newHistory = recentSearches.filter(t => t !== term);
        setRecentSearches(newHistory);
        localStorage.setItem('recentSearches', JSON.stringify(newHistory));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            saveSearch(inputValue);
        }
    };

    const handleTagClick = (term: string) => {
        setInputValue(term);
    };

    const handleFavoriteToggle = () => {
        const newState = !isFavActive;
        setIsFavActive(newState);
        if (onFilterFavorite) {
            onFilterFavorite(newState);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                {/* Unified Search Bar Container */}
                <div
                    className="glass-panel"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                        borderRadius: '12px', // Fully rounded for simple mode? Or keep consistent.
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        border: '1px solid rgba(255,255,255,0.8)',
                        background: 'rgba(255,255,255,0.6)',
                        padding: '0 12px',
                        backdropFilter: 'blur(10px)',
                        height: '40px',
                    }}
                >
                    <Search size={16} color="rgba(0, 0, 0, 0.45)" style={{ marginRight: '8px' }} />
                    <Input
                        placeholder="검색어를 입력하세요."
                        value={inputValue}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        variant="borderless"
                        style={{
                            flex: 1,
                            background: 'transparent',
                            padding: '4px 0',
                            color: '#2c3e50'
                        }}
                    />
                    {!simple && onFilterFavorite && (
                        <div
                            onClick={handleFavoriteToggle}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                marginLeft: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Star
                                size={18}
                                fill={isFavActive ? "#f1c40f" : "none"}
                                color={isFavActive ? "#f1c40f" : "rgba(0,0,0,0.45)"}
                            />
                        </div>
                    )}
                </div>

                {!simple && onFilterTags && (
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Tag Filter"
                        onChange={onFilterTags}
                        className="glass-panel"
                        style={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '12px',
                            alignItems: 'center',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                        }}
                        variant="borderless"
                        optionLabelProp="label"
                        maxTagCount="responsive"
                        // @ts-ignore
                        styles={{
                            popup: { root: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' } }
                        }}
                    >
                        {Array.from(new Set(tasks.flatMap(t => t.tags || []))).map(tag => (
                            <Option key={tag} value={tag} label={`#${tag}`}>
                                {tag}
                            </Option>
                        ))}
                    </Select>
                )}

                {!simple && (
                    <div style={{ display: 'flex', width: '100%' }}>
                        <div style={{ gap: '4px', display: 'flex', width: '100%' }}>
                            <Select
                                showSearch={false}
                                placeholder="Priority"
                                onChange={onFilterPriority}
                                className="glass-panel"
                                style={{
                                    flex: 1,
                                    height: '30px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    color: '#000',
                                }}
                                variant="borderless"
                                dropdownStyle={{ minWidth: '90px', fontSize: '11px' }}
                                // @ts-ignore
                                styles={{ popup: { minWidth: '140px', fontSize: '11px', background: 'rgba(255, 255, 255, 0.9)' } }}
                                options={[
                                    { value: 'HIGH', label: 'High' },
                                    { value: 'MEDIUM', label: 'Medium' },
                                    { value: 'LOW', label: 'Low' },
                                ]}
                            />

                            {onFilterDate && (
                                <Select
                                    placeholder="Date"
                                    onChange={onFilterDate}
                                    className="glass-panel"
                                    style={{
                                        flex: 1,
                                        height: '30px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                    }}
                                    variant="borderless"
                                    dropdownStyle={{ minWidth: '90px', fontSize: '11px' }}
                                    // @ts-ignore
                                    styles={{
                                        popup: { root: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', fontSize: '10px' } }
                                    }}
                                    options={[
                                        { value: 'all', label: 'ALL' },
                                        { value: 'today', label: '오늘' },
                                        { value: 'week', label: '이번주' },
                                        { value: 'overdue', label: '지남' },
                                    ]}
                                />
                            )}

                            {onSearchScope && (
                                <Select
                                    placeholder="제목+내용"
                                    onChange={onSearchScope}
                                    className="glass-panel"
                                    style={{
                                        flex: 1,
                                        height: '30px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                    }}
                                    variant="borderless"
                                    dropdownStyle={{ minWidth: '100px', fontSize: '11px' }}
                                    // @ts-ignore
                                    styles={{ popup: { root: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', fontSize: '11px' } } }}
                                    options={[
                                        { value: 'all', label: '제목+내용' },
                                        { value: 'title', label: '제목' },
                                        { value: 'description', label: '내용' },
                                    ]}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {!simple && recentSearches.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%', paddingLeft: '4px' }}>
                    {recentSearches.map((term) => (
                        <Tag
                            key={term}
                            closable
                            onClose={(e) => {
                                e.preventDefault();
                                handleDelete(term);
                            }}
                            onClick={() => handleTagClick(term)}
                            closeIcon={<X size={12} style={{ verticalAlign: 'middle' }} />}
                            bordered={false}
                            style={{
                                cursor: 'pointer',
                                borderRadius: '16px',
                                border: 'none',
                                background: 'rgba(255, 255, 255, 0.5)',
                                backdropFilter: 'blur(4px)',
                                padding: '4px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                color: '#596275',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {term}
                        </Tag>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
