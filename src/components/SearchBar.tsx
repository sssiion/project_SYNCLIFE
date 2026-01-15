import React from 'react';
import { Input, Select } from 'antd';
import { Search } from 'lucide-react';
import type { Priority } from '../types';

const { Option } = Select;

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterPriority: (priority: Priority | 'ALL') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterPriority }) => {
    return (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <Input
                placeholder="Search tasks..."
                prefix={<Search size={16} color="rgba(0,0,0,0.45)" />}
                onChange={(e) => onSearch(e.target.value)}
                className="glass-panel"
                style={{
                    maxWidth: '300px',
                    background: 'rgba(255, 255, 255, 0.45)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    color: '#2c3e50'
                }}
            />
            <Select
                defaultValue="ALL"
                onChange={(value: Priority | 'ALL') => onFilterPriority(value)}
                style={{ width: 120 }}
                // @ts-ignore - fixing deprecated warning per instructions
                styles={{ popup: { root: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' } } }}
                className="glass-select"
            >
                <Option value="ALL">All Levels</Option>
                <Option value="HIGH">High</Option>
                <Option value="MEDIUM">Medium</Option>
                <Option value="LOW">Low</Option>
            </Select>
        </div>
    );
};

export default SearchBar;
