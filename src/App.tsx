import { useState } from 'react';
import Layout from './components/Layout';
import Board from './components/Board';
import NewTaskModal from './components/NewTaskModal';
import FloatingSidebar from './components/FloatingSidebar';
import { ConfigProvider, theme } from 'antd';
import type { Task } from './types';


function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingTask(null);
  };

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
      <div style={{ paddingRight: isSidebarCollapsed ? '0' : '320px', transition: 'padding-right 0.3s ease' }}> {/* Make space for sidebar */}
        <Layout>
          {/* Main Content Area */}
          <div style={{ marginBottom: 24, display: 'none' }}>
            {/* Hidden original search bar area as it's moved to sidebar */}
          </div>

          <Board
            searchQuery={searchQuery}
            filterPriority={filterPriority}
            filterTags={filterTags}
            onEditTask={handleEditTask}
          />

          <NewTaskModal
            visible={isModalVisible}
            onClose={handleCloseModal}
            taskToEdit={editingTask}
          />
        </Layout>

        <FloatingSidebar
          onAddTask={() => setIsModalVisible(true)}
          onSearch={setSearchQuery}
          onFilterPriority={setFilterPriority}
          onFilterTags={setFilterTags}
          onCollapse={setIsSidebarCollapsed}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
