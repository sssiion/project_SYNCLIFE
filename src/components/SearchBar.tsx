import React, { useState, useEffect } from 'react';
import { Input, Select, Tag } from 'antd';
import { Search, X } from 'lucide-react';
import type { Priority } from '../types';
import { useTaskStore } from '../store/useTaskStore';

const { Option } = Select;

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterPriority: (priority: Priority | 'ALL') => void;
    onFilterTags?: (tags: string[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterPriority, onFilterTags }) => {
    const tasks = useTaskStore((state) => state.tasks);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

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
        const val = e.target.value;
        setInputValue(val);
        onSearch(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            saveSearch(inputValue);
        }
    };

    const handleTagClick = (term: string) => {
        setInputValue(term);
        onSearch(term);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '12px', width: '100%' }}>
                <Input
                    placeholder="검색어를 입력하세요."
                    prefix={<Search size={16} color="rgba(0,0,0,0.45)" />}
                    value={inputValue}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="glass-panel"
                    style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.8)',
                        background: 'rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 1,
                    }}
                />
                <Select
                    defaultValue="ALL"
                    onChange={onFilterPriority}
                    className="glass-panel priority-filter"
                    style={{
                        width: 120,
                        height: '40px', // Match Input height
                        borderRadius: '12px',
                    }}
                    bordered={false}
                    // @ts-ignore
                    styles={{ popup: { root: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' } } }}
                >
                    <Option value="ALL">All Levels</Option>
                    <Option value="HIGH">High</Option>
                    <Option value="MEDIUM">Medium</Option>
                    <Option value="LOW">Low</Option>
                </Select>

                {onFilterTags && (
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Tag Filter"
                        onChange={onFilterTags}
                        className="glass-panel"
                        style={{
                            minWidth: 120,
                            maxWidth: 200,
                            height: '40px',
                            borderRadius: '12px',
                        }}
                        bordered={false}
                        optionLabelProp="label"
                    >
                        {Array.from(new Set(tasks.flatMap(t => t.tags || []))).map(tag => (
                            <Option key={tag} value={tag} label={`#${tag}`}>
                                {tag}
                            </Option>
                        ))}
                    </Select>
                )}
            </div>

            {recentSearches.length > 0 && (
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
