import React, { useState, useEffect } from 'react';
import Header from './Header';
import ScopeSelector from './ScopeSelector';
import BentoStats from './BentoStats';
import ProgressBar from './ProgressBar';
import PeriodBar from './PeriodBar';
import YesterdayPendingSection from './YesterdayPendingSection';
import TaskBoard from './TaskBoard';
import ShortcutsFooter from './ShortcutsFooter';
import BackupModal from './BackupModal';
import { useWorkPlanner } from '../../hooks/useWorkPlanner';

export default function WorkflowPlanner({ globalTheme, onToggleGlobalTheme }) {
  const {
    tasks,
    scope,
    setScope,
    dateOffsets,
    currentPeriodKey,
    yesterdayPeriodKey,
    yesterdayLabel,
    todoTasks,
    doneTasks,
    overdueTasks,
    tabCounts,
    totalCount,
    doneCount,
    pendingCount,
    completionRate,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    addTask,
    toggleTask,
    moveToDone,
    moveToTodo,
    markAllTodoAsDone,
    moveTaskToSection,
    updateTaskTitle,
    deleteTask,
    reorderTasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    updateTaskNotes,
    addAttachmentToTask,
    deleteAttachmentFromTask,
    rollOverTask,
    rollOverAll,
    clearCompleted,
    navigatePeriod,
    resetPeriod,
    restoreBackup
  } = useWorkPlanner();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Sync with global theme if provided
  const activeTheme = globalTheme || theme;
  const handleToggleTheme = onToggleGlobalTheme || toggleTheme;

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsAddOpen(true);
      } else if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('task-search-input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        setIsAddOpen(false);
        setIsBackupOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="planner-embedded-view" style={{ width: '100%' }}>
      <div className="app-container" style={{ maxWidth: '100%', margin: '0 auto', padding: '0 0 24px 0' }}>
        {/* Header with Search, Theme toggle & Backup button */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          theme={activeTheme}
          toggleTheme={handleToggleTheme}
          onOpenBackup={() => setIsBackupOpen(true)}
        />

        {/* Scope Selector Tabs (Day, Week, Month) */}
        <ScopeSelector
          scope={scope}
          setScope={setScope}
          tabCounts={tabCounts}
          resetPeriod={resetPeriod}
        />

        {/* Bento Stats Overview */}
        <BentoStats
          totalCount={totalCount}
          doneCount={doneCount}
          pendingCount={pendingCount}
          completionRate={completionRate}
        />

        {/* Progress Bar */}
        <ProgressBar completionRate={completionRate} />

        {/* Period Navigation */}
        <PeriodBar
          scope={scope}
          currentPeriodKey={currentPeriodKey}
          offset={dateOffsets[scope]}
          onPrev={() => navigatePeriod(-1)}
          onNext={() => navigatePeriod(1)}
          onReset={resetPeriod}
        />

        {/* Main Task Card */}
        <main className="task-card">
          {/* Yesterday's Pending Tasks: Shown right above today's goals */}
          {overdueTasks.length > 0 && (
            <YesterdayPendingSection
              overdueTasks={overdueTasks}
              yesterdayPeriodKey={yesterdayPeriodKey}
              yesterdayLabel={yesterdayLabel}
              scope={scope}
              onToggle={toggleTask}
              onEdit={updateTaskTitle}
              onDelete={deleteTask}
              onRollOver={rollOverTask}
              onRollOverAll={rollOverAll}
            />
          )}

          {/* 2 SECTIONS: TO-DO & DONE */}
          <TaskBoard
            todoTasks={todoTasks}
            doneTasks={doneTasks}
            searchQuery={searchQuery}
            onToggle={toggleTask}
            onDirectMoveToDone={moveToDone}
            onDirectMoveToTodo={moveToTodo}
            onMarkAllDone={markAllTodoAsDone}
            onClearCompleted={clearCompleted}
            onEdit={updateTaskTitle}
            onDelete={deleteTask}
            onReorder={reorderTasks}
            onMoveToSection={moveTaskToSection}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
            onUpdateNotes={updateTaskNotes}
            onAddAttachment={addAttachmentToTask}
            onDeleteAttachment={deleteAttachmentFromTask}
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            onAdd={addTask}
          />
        </main>

        {/* Shortcuts, Print & Clear completed */}
        <ShortcutsFooter
          onClearCompleted={clearCompleted}
          onPrint={() => window.print()}
        />

        {/* Backup Modal */}
        <BackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          tasks={tasks}
          onRestore={restoreBackup}
        />
      </div>
    </div>
  );
}
