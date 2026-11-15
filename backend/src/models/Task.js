import mongoose from 'mongoose';
import { getWeekStart, isValidDateString } from '../utils/week.js';

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      validate: {
        validator: isValidDateString,
        message: 'Date must be a valid calendar date in YYYY-MM-DD format',
      },
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      validate: {
        validator: (value) => TIME_PATTERN.test(value),
        message: 'Start time must be in HH:mm (24-hour) format',
      },
    },
    endTime: {
      type: String,
      default: null,
      validate: {
        validator: (value) => value === null || value === '' || TIME_PATTERN.test(value),
        message: 'End time must be in HH:mm (24-hour) format',
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium or high',
      },
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['in-progress', 'completed'],
        message: 'Status must be in-progress or completed',
      },
      default: 'in-progress',
    },
    weekStart: {
      type: String,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_document, result) => {
        delete result.__v;
        return result;
      },
    },
  }
);

taskSchema.index({ weekStart: 1, date: 1 });
taskSchema.index({ status: 1 });

taskSchema.pre('validate', function validateTask(next) {
  if (this.date && isValidDateString(this.date)) {
    this.weekStart = getWeekStart(this.date);
  }

  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate('endTime', 'End time must be later than start time');
  }

  next();
});

taskSchema.pre('save', function syncCompletedAt(next) {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'completed' ? new Date() : null;
  }

  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
