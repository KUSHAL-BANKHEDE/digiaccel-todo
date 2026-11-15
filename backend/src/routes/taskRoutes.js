import { Router } from 'express';
import * as taskController from '../controllers/taskController.js';
import validate from '../middleware/validate.js';
import validateObjectId from '../middleware/validateObjectId.js';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateStatusSchema,
  updateTaskSchema,
  weeklySummaryQuerySchema,
} from '../validators/taskValidator.js';

const router = Router();

router.get(
  '/weeks',
  validate(weeklySummaryQuerySchema, 'query'),
  taskController.getWeeklySummary
);

router
  .route('/')
  .get(validate(listTasksQuerySchema, 'query'), taskController.listTasks)
  .post(validate(createTaskSchema), taskController.createTask);

router
  .route('/:id')
  .all(validateObjectId())
  .get(taskController.getTask)
  .patch(validate(updateTaskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

router.patch(
  '/:id/status',
  validateObjectId(),
  validate(updateStatusSchema),
  taskController.updateTaskStatus
);

export default router;
