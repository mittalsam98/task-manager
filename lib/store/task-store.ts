import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

interface TaskStore {
  tasks: Task[];
  filters: TaskFilters;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  setStatusFilter: (status?: TaskStatus) => void;
  setPriorityFilter: (priority?: TaskPriority) => void;
  setSearchFilter: (search?: string) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt') => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialTasks: Task[] = [
  {
    id: generateId(),
    title: 'Set up project structure',
    description: 'Initialize the task management application',
    status: 'DONE',
    priority: 'HIGH',
    assignee: 'Sachin Mittal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Implement task CRUD operations',
    description: 'Create, read, update, and delete functionality for tasks',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    assignee: 'Rahul Sharma',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: 'Add filtering and sorting',
    description: 'Implement task filtering by status and priority',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    assignee: 'Sachin Mit',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useTaskStore = create<TaskStore>()(
  devtools(
    (set, get) => ({
      tasks: initialTasks,
      filters: {},
      sortBy: 'createdAt',
      sortOrder: 'desc',
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }), false, 'addTask');
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }), false, 'updateTask');
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id),
        }), false, 'deleteTask');
      },
      
      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, status, updatedAt: new Date().toISOString() }
              : task
          ),
        }), false, 'updateTaskStatus');
      },
      
      // Filter Actions
      setStatusFilter: (status) =>
        set((state) => ({
          filters: { ...state.filters, status },
        }), false, 'setStatusFilter'),
        
      setPriorityFilter: (priority) =>
        set((state) => ({
          filters: { ...state.filters, priority },
        }), false, 'setPriorityFilter'),
        
      setSearchFilter: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
        }), false, 'setSearchFilter'),
        
      setSortBy: (sortBy) =>
        set({ sortBy }, false, 'setSortBy'),
        
      setSortOrder: (sortOrder) =>
        set({ sortOrder }, false, 'setSortOrder'),
        
      clearFilters: () =>
        set({ filters: {} }, false, 'clearFilters'),
        
      // Computed functions
      getFilteredTasks: () => {
        const { tasks, filters, sortBy, sortOrder } = get();
        
        let filteredTasks = [...tasks];
        
        console.log({filters, sortBy, sortOrder})
        if (filters.status) {
          filteredTasks = filteredTasks.filter(task => task.status === filters.status);
        }
        
        if (filters.priority) {
          filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(searchLower) ||
            (task.description && task.description.toLowerCase().includes(searchLower))
          );
        }
        
        filteredTasks.sort((a, b) => {
          let aValue: string | number | Date, bValue: string | number | Date;
          
          switch (sortBy) {
            case 'dueDate':
              aValue = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
              bValue = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
              break;
            case 'priority':
              const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
              aValue = priorityOrder[a.priority as TaskPriority];
              bValue = priorityOrder[b.priority as TaskPriority];
              break;
            case 'createdAt':
            default:
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
          }
          
          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });
        
        return filteredTasks;
      },
    }),
    { name: 'task-store' }
  )
); 