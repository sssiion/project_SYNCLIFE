import { useState } from 'react';
import Layout from './components/Layout';
import Board from './components/Board';
import NewTaskModal from './components/NewTaskModal';
import SearchBar from './components/SearchBar';
import { ConfigProvider, theme, Button } from 'antd';
import { Plus } from 'lucide-react';
import type { Priority } from './types';

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'ALL'>('ALL');

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          fontFamily: 'Inter, sans-serif',
          colorPrimary: '#8ec5fc', // Pastel Blue
          colorBgContainer: 'rgba(255, 255, 255, 0.6)',
          colorText: '#2c3e50',
          colorTextHeading: '#1e272e',
        },
      }}
    >
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <SearchBar
            onSearch={setSearchQuery}
            onFilterPriority={setFilterPriority}
          />
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalVisible(true)}
            size="large"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 14px 0 rgba(118, 75, 162, 0.39)'
            }}
          >
            Add Task
          </Button>
        </div>

        <Board searchQuery={searchQuery} filterPriority={filterPriority} />

        <NewTaskModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
