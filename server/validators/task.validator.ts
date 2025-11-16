import { z } from 'zod';

const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'BLOCKED']);
const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().uuid('Invalid project ID'),
  assignedToId: z.string().uuid().optional(),
  parentTaskId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
  parentTaskId: z.string().uuid().optional(),
});

export const assignTaskSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const taskIdSchema = z.object({
  taskId: z.string().uuid('Invalid task ID format'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type AssignTaskInput = z.infer<typeof assignTaskSchema>;
