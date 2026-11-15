import { z } from 'zod';
import { isValidDateString } from '../utils/week.js';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const dateSchema = z
  .string({ required_error: 'Date is required' })
  .refine(isValidDateString, 'Date must be a valid calendar date in YYYY-MM-DD format');

const timeSchema = z
  .string({ required_error: 'Start time is required' })
  .regex(TIME_PATTERN, 'Time must be in HH:mm (24-hour) format');

const nullableTimeSchema = timeSchema.nullable();
const prioritySchema = z.enum(['low', 'medium', 'high']).nullable();
const statusSchema = z.enum(['in-progress', 'completed']);
const titleSchema = z
  .string({ required_error: 'Title is required' })
  .trim()
  .min(1, 'Title is required')
  .max(120, 'Title cannot exceed 120 characters');
const descriptionSchema = z
  .string()
  .trim()
  .max(1000, 'Description cannot exceed 1000 characters');

const hasValidTimeRange = (data) =>
  !data.startTime || !data.endTime || data.endTime > data.startTime;

export const createTaskSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema.optional(),
    date: dateSchema,
    startTime: timeSchema,
    endTime: nullableTimeSchema.optional(),
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
  })
  .strict()
  .refine(hasValidTimeRange, {
    message: 'End time must be later than start time',
    path: ['endTime'],
  });

export const updateTaskSchema = z
  .object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    date: dateSchema.optional(),
    startTime: timeSchema.optional(),
    endTime: nullableTimeSchema.optional(),
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
  .refine(hasValidTimeRange, {
    message: 'End time must be later than start time',
    path: ['endTime'],
  });

export const updateStatusSchema = z
  .object({
    status: statusSchema,
  })
  .strict();

export const listTasksQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    weekStart: dateSchema.optional(),
    date: dateSchema.optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    status: statusSchema.optional(),
    sort: z.enum(['date', '-date', 'createdAt', '-createdAt', 'title', '-title']).optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
  })
  .strict()
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: '`from` must be on or before `to`',
    path: ['from'],
  });

export const weeklySummaryQuerySchema = z
  .object({
    from: dateSchema.optional(),
    to: dateSchema.optional(),
  })
  .strict()
  .refine((data) => !data.from || !data.to || data.from <= data.to, {
    message: '`from` must be on or before `to`',
    path: ['from'],
  });
