import { useState, useEffect } from 'react';
import { getPeriodKey, formatPeriodLabel } from '../utils/dateUtils';

const STORAGE_KEY = 'work_planner_tasks';
const BACKUP_STORAGE_KEY = 'wp_tasks';
const THEME_STORAGE_KEY = 'wp_theme';

export function useWorkPlanner() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [scope, setScope] = useState('day');
  const [dateOffsets, setDateOffsets] = useState({ day: 0, week: 0, month: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  // Sync tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to sync tasks to localStorage', e);
    }
  }, [tasks]);

  // Sync theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentPeriodKey = getPeriodKey(scope, dateOffsets[scope]);
  const yesterdayPeriodKey = scope === 'day' ? getPeriodKey('day', dateOffsets['day'] - 1) : null;
  const yesterdayLabel = yesterdayPeriodKey ? formatPeriodLabel('day', yesterdayPeriodKey) : '';

  // Add Task
  const addTask = (title, priority = 'medium', category = 'Work', dueTime = '', attachments = []) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask = {
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      scope,
      period: currentPeriodKey,
      done: false,
      priority,
      category,
      dueTime: dueTime ? dueTime.trim() : '',
      subtasks: [],
      notes: '',
      attachments: attachments || [],
      created: Date.now()
    };

    setTasks((prev) => [newTask, ...prev]);
  };

  // Toggle Task Completion
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextDone = !t.done;
          return {
            ...t,
            done: nextDone,
            doneAt: nextDone ? Date.now() : null
          };
        }
        return t;
      })
    );
  };

  // Direct move to Done
  const moveToDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            done: true,
            doneAt: Date.now()
          };
        }
        return t;
      })
    );
  };

  // Direct move back to To-do
  const moveToTodo = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            done: false,
            doneAt: null
          };
        }
        return t;
      })
    );
  };

  // Mark all current To-do as Done
  const markAllTodoAsDone = () => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.scope === scope && t.period === currentPeriodKey && !t.done) {
          return {
            ...t,
            done: true,
            doneAt: Date.now()
          };
        }
        return t;
      })
    );
  };

  // Edit task
  const updateTaskTitle = (id, newTitle) => {
    if (!newTitle || !newTitle.trim()) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle.trim() } : t))
    );
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Reorder tasks (Drag and Drop)
  const reorderTasks = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    setTasks((prev) => {
      const sourceIdx = prev.findIndex((t) => t.id === sourceId);
      const targetIdx = prev.findIndex((t) => t.id === targetId);
      if (sourceIdx < 0 || targetIdx < 0) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(sourceIdx, 1);
      updated.splice(targetIdx, 0, movedItem);
      return updated;
    });
  };

  // Move task to section via drag and drop
  const moveTaskToSection = (taskId, targetSection) => {
    if (targetSection === 'done') {
      moveToDone(taskId);
    } else if (targetSection === 'todo') {
      moveToTodo(taskId);
    }
  };

  // Subtasks CRUD
  const addSubtask = (taskId, text) => {
    if (!text || !text.trim()) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const subtasks = t.subtasks || [];
          return {
            ...t,
            subtasks: [
              ...subtasks,
              {
                id: `st_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                text: text.trim(),
                done: false
              }
            ]
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const subtasks = (t.subtasks || []).map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          );
          return { ...t, subtasks };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId)
          };
        }
        return t;
      })
    );
  };

  const updateTaskNotes = (taskId, notes) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, notes } : t))
    );
  };

  // Attachments CRUD
  const addAttachmentToTask = (taskId, attachment) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const attachments = t.attachments || [];
          return {
            ...t,
            attachments: [...attachments, attachment]
          };
        }
        return t;
      })
    );
  };

  const deleteAttachmentFromTask = (taskId, attachmentId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            attachments: (t.attachments || []).filter((a) => a.id !== attachmentId)
          };
        }
        return t;
      })
    );
  };

  // Move single task to currently viewed day/period
  const rollOverTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, period: currentPeriodKey } : t))
    );
  };

  // Roll over all overdue/yesterday tasks to currently viewed day/period
  const rollOverAll = (overdueTasksToRoll) => {
    const overdueIds = new Set(overdueTasksToRoll.map((t) => t.id));
    setTasks((prev) =>
      prev.map((t) => (overdueIds.has(t.id) ? { ...t, period: currentPeriodKey } : t))
    );
  };

  // Clear completed tasks for current view
  const clearCompleted = () => {
    const currentCompleted = tasks.filter(
      (t) => t.scope === scope && t.period === currentPeriodKey && t.done
    );
    if (!currentCompleted.length) {
      alert('No completed tasks in current view.');
      return;
    }
    if (confirm(`Clear ${currentCompleted.length} completed task(s)?`)) {
      setTasks((prev) =>
        prev.filter(
          (t) => !(t.scope === scope && t.period === currentPeriodKey && t.done)
        )
      );
    }
  };

  // Period offset navigation
  const navigatePeriod = (delta) => {
    setDateOffsets((prev) => ({ ...prev, [scope]: prev[scope] + delta }));
  };

  const resetPeriod = () => {
    setDateOffsets((prev) => ({ ...prev, [scope]: 0 }));
  };

  // Base tasks for currently viewed period
  const baseScopeTasks = tasks.filter(
    (t) => t.scope === scope && t.period === currentPeriodKey
  );

  // Overdue / yesterday tasks: any incomplete task with period < currentPeriodKey
  const overdueTasks = tasks.filter(
    (t) => t.scope === scope && t.period < currentPeriodKey && !t.done
  );

  let currentTasks = baseScopeTasks;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    currentTasks = currentTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
  }

  // Split into To-do and Done lists
  const todoTasks = currentTasks.filter((t) => !t.done);
  const doneTasks = currentTasks.filter((t) => t.done);

  // Scope counters for tabs
  const tabCounts = {
    day: tasks.filter((t) => t.scope === 'day' && t.period === getPeriodKey('day', 0) && !t.done).length,
    week: tasks.filter((t) => t.scope === 'week' && t.period === getPeriodKey('week', 0) && !t.done).length,
    month: tasks.filter((t) => t.scope === 'month' && t.period === getPeriodKey('month', 0) && !t.done).length
  };

  const totalCount = baseScopeTasks.length;
  const doneCount = baseScopeTasks.filter((t) => t.done).length;
  const pendingCount = totalCount - doneCount + overdueTasks.length;
  const completionRate =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Restore backup
  const restoreBackup = (newTasks) => {
    if (Array.isArray(newTasks)) {
      setTasks(newTasks);
      return true;
    }
    return false;
  };

  return {
    tasks,
    scope,
    setScope,
    dateOffsets,
    currentPeriodKey,
    yesterdayPeriodKey,
    yesterdayLabel,
    currentTasks,
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
  };
}
