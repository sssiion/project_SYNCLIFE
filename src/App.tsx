import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Board from './components/Board';
import NewTaskModal from './components/NewTaskModal';
import FloatingSidebar from './components/FloatingSidebar';
import { ConfigProvider, theme } from 'antd';
import type { Task, SortOption } from './types';
import { useMediaQuery } from './hooks/useMediaQuery';
import { useTaskStore } from './store/useTaskStore'; // Import Store
import OnboardingOverlay from './components/OnboardingOverlay'; // Import Overlay


function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState<string>('all'); // 'all', 'today', 'week', 'overdue'
  const [filterFavorite, setFilterFavorite] = useState<boolean>(false);
  const [filterHideDone, setFilterHideDone] = useState<boolean>(false);
  const [searchScope, setSearchScope] = useState<string>('title'); // 'all', 'title', 'tag'
  const [sortOption, setSortOption] = useState<SortOption>('priority-asc'); // Default sort
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

  // Tutorial Logic
  const hasSeenTutorial = useTaskStore((state) => state.hasSeenTutorial);
  const isDarkMode = useTaskStore((state) => state.isDarkMode);

  // Apply Dark Mode Class to Body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontFamily: 'Inter, sans-serif',
          colorPrimary: '#8ec5fc', // Pastel Blue
          colorBgContainer: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.6)',
          colorText: isDarkMode ? '#ecf0f1' : '#2c3e50',
          colorTextHeading: isDarkMode ? '#ffffff' : '#1e272e',
        },
      }}
    >
      <div style={{
        paddingRight: isMobile ? 0 : (isSidebarCollapsed ? 0 : '320px'),
        paddingBottom: isMobile ? '60px' : 0, // Space for bottom sidebar toggle
        transition: 'all 0.3s ease'
      }}>
        {/* Onboarding Overlay */}
        {!hasSeenTutorial && <OnboardingOverlay />}

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
            sortOption={sortOption}
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
          sortOption={sortOption}
          onSortChange={setSortOption}
          onCollapse={setIsSidebarCollapsed}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
