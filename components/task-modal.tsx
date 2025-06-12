'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTaskStore, Task } from '@/lib/store/task-store';
import { PRIORITY_ITEMS, TASK_ITEMS } from '@/lib/constants';
import { taskSchema, TaskFormData, transformTaskData } from '@/lib/validation/task-schema';

interface TaskModalProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  const { addTask, updateTask } = useTaskStore();
  const isEditing = !!task;
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: '',
      assignee: '',
    },
  });

  const watchedStatus = watch('status');
  const watchedPriority = watch('priority');

  useEffect(() => {
    if (open) {
      if (isEditing && task) {
        // Editing mode
        reset({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate || '',
          assignee: task.assignee || '',
        });
      } else {
        // Adding mode
        reset({
          title: '',
          description: '',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '',
          assignee: '',
        });
      }
    }
  }, [task, open, isEditing, reset]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const taskData = transformTaskData(data);
      
      if (isEditing && task) {
        updateTask(task.id, taskData);
      } else {
        addTask(taskData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleStatusChange = (value: string) => {
    setValue('status', value as 'TODO' | 'IN_PROGRESS' | 'DONE');
  };

  const handlePriorityChange = (value: string) => {
    setValue('priority', value as 'LOW' | 'MEDIUM' | 'HIGH');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEditing ? 'Update the task details below.' : 'Create a new task'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </div>
            <input
              type="text"
              {...register('title')}
              className={`w-full p-2 border rounded-md ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{String(errors.title?.message)}</p>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Description</div>
            <textarea
              {...register('description')}
              className={`w-full p-2 border rounded-md ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{String(errors.description?.message)}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-1">Status</div>
              <Select value={watchedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{String(errors.status?.message)}</p>
              )}
            </div>

            <div>
              <div className="text-sm font-medium mb-1">Priority</div>
              <Select value={watchedPriority} onValueChange={handlePriorityChange}>
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_ITEMS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{String(errors.priority?.message)}</p>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Due Date</div>
            <input
              type="date"
              {...register('dueDate')}
              className={`w-full p-2 border rounded-md ${
                errors.dueDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{String(errors.dueDate?.message)}</p>
            )}
          </div>

          <div>
            <div className="text-sm font-medium mb-1">Assignee</div>
            <input
              type="text"
              {...register('assignee')}
              className={`w-full p-2 border rounded-md ${
                errors.assignee ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter assignee name"
            />
            {errors.assignee && (
              <p className="text-red-500 text-sm mt-1">{String(errors.assignee?.message)}</p>
            )}
          </div>
        </form>

        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEditing ? 'Updating...' : 'Adding...') 
              : (isEditing ? 'Update Task' : 'Add Task')
            }
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 