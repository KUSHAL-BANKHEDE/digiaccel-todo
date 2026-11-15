import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../middleware/asyncHandler.js';
import escapeRegex from '../utils/escapeRegex.js';
import { getWeekEnd } from '../utils/week.js';

const ALLOWED_UPDATE_FIELDS = [
  'title',
  'description',
  'date',
  'startTime',
  'endTime',
  'priority',
  'status',
];

const SORT_OPTIONS = {
  date: { date: 1, startTime: 1 },
  '-date': { date: -1, startTime: -1 },
  createdAt: { createdAt: 1 },
  '-createdAt': { createdAt: -1 },
  title: { title: 1 },
  '-title': { title: -1 },
};

export const listTasks = asyncHandler(async (req, res) => {
  const { search, weekStart, date, from, to, status, sort, limit } = req.validated.query;
  const filter = {};

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }

  if (weekStart) {
    filter.weekStart = weekStart;
  }

  if (date) {
    filter.date = date;
  } else if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) filter.date.$lte = to;
  }

  if (status) {
    filter.status = status;
  }

  const tasks = await Task.find(filter)
    .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.date)
    .limit(limit || 200);

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({ success: true, data: task });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);

  res.status(201).json({ success: true, data: task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  ALLOWED_UPDATE_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      task[field] = req.body[field];
    }
  });

  await task.save();

  res.status(200).json({ success: true, data: task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: { id: task.id },
  });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  task.status = req.body.status;
  await task.save();

  res.status(200).json({ success: true, data: task });
});

export const getWeeklySummary = asyncHandler(async (req, res) => {
  const { from, to } = req.validated.query;
  const match = {};

  if (from || to) {
    match.weekStart = {};
    if (from) match.weekStart.$gte = from;
    if (to) match.weekStart.$lte = to;
  }

  const weeks = await Task.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$weekStart',
        openCount: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
        completedCount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  const data = weeks.map((week) => ({
    weekStart: week._id,
    weekEnd: getWeekEnd(week._id),
    openCount: week.openCount,
    completedCount: week.completedCount,
    total: week.total,
  }));

  res.status(200).json({ success: true, count: data.length, data });
});
