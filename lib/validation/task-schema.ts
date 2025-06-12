import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../store/task-store';

// Custom date validation function
const isValidDate = (dateString: string | undefined): boolean => {
  if (!dateString) return true; 
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
};

// Custom future date validation
const isFutureDate = (dateString: string | undefined): boolean => {
  if (!dateString) return true; 
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return inputDate >= today;
};

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters in lenght')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
    
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters in length')
    .optional()
    .or(z.literal('')),
    
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'] as const, {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
  
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'] as const, {
    errorMap: () => ({ message: 'Please select a valid priority' }),
  }),
  
  dueDate: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(isValidDate, {
      message: 'Please enter a valid date in YYYY-MM-DD format',
    })
    .refine(isFutureDate, {
      message: 'Due date cannot be in the past',
    }),
    
  assignee: z
    .string()
    .max(50, 'Assignee name must not exceed 50 characters')
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true; // Optional field
      return /^[a-zA-Z\s\-']+$/.test(val);
    }, {
      message: 'Assignee name can only contain letters, spaces, hyphens, and apostrophes',
    }),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const transformTaskData = (data: TaskFormData) => ({
  title: data.title.trim(),
  description: data.description?.trim() || undefined,
  status: data.status as TaskStatus,
  priority: data.priority as TaskPriority,
  dueDate: data.dueDate || undefined,
  assignee: data.assignee?.trim() || undefined,
}); 