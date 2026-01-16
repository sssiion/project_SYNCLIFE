import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Board from './components/Board';
import NewTaskModal from './components/NewTaskModal';
import FloatingSidebar from './components/FloatingSidebar';
import { ConfigProvider, theme } from 'antd';
import type { Task } from './types';
import { useMediaQuery } from './hooks/useMediaQuery';


function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState<string>('all'); // 'all', 'today', 'week', 'overdue'
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [filterHideDone, setFilterHideDone] = useState<boolean>(false);
  const [searchScope, setSearchScope] = useState<string>('title'); // 'all', 'title', 'tag'
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input/textarea is focused
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement).isContentEditable
      ) {
        return;
      }

      // 'N' for New Task
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsModalVisible(true);
      }

      // 'S' for Search
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <div style={{
        paddingRight: isMobile ? 0 : (isSidebarCollapsed ? 0 : '320px'),
        paddingBottom: isMobile ? '60px' : 0, // Space for bottom sidebar toggle
        transition: 'all 0.3s ease'
      }}>
        <Layout>
          {/* Main Content Area */}
          <div style={{ marginBottom: 24, display: 'none' }}>
            {/* Hidden original search bar area as it's moved to sidebar */}
          </div>

          <Board
            searchQuery={searchQuery}
            filterPriority={filterPriority}
            filterTags={filterTags}
            filterDate={filterDate}
            filterFavorite={filterFavorite}
            filterHideDone={filterHideDone}
            onFilterHideDone={setFilterHideDone}
            searchScope={searchScope}
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
          onFilterDate={setFilterDate}
          onFilterFavorite={setFilterFavorite}
          onSearchScope={setSearchScope}
          onCollapse={setIsSidebarCollapsed}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
