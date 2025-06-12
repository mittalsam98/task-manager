'use client';

import { TaskStatus, useTaskStore } from '@/lib/store/task-store';
import TaskCard from './task-card';

const statusColumns: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'TODO', title: 'To Do', color: 'bg-slate-100' },
  { status: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-100' },
  { status: 'DONE', title: 'Done', color: 'bg-green-100' },
];

export function TaskBoard() {
  const { getFilteredTasks } = useTaskStore();
  const tasks = getFilteredTasks();

  const getTasksByStatus = (status: TaskStatus) => {
    console.log('getTasksByStatus',status)
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map(({ status, title, color }) => {
        const tasksForStatus = getTasksByStatus(status);
        
        return (
          <div key={status} className="space-y-4">
            <div className={`p-4 rounded-lg ${color}`}>
              <h3 className="font-semibold text-lg">{title}</h3>
              <div className="text-sm text-gray-600 mt-1">
                {tasksForStatus.length} tasks
              </div>
            </div>
            
            <div className="min-h-[300px]">
              {tasksForStatus.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {tasksForStatus.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No tasks in {title.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 