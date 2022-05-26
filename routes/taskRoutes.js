import express from 'express';

import {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  changeStatus,
} from '../controllers/taskController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', addTask);
router
  .route('/:id')
  .get(checkAuth, getTask)
  .put(checkAuth, updateTask)
  .delete(checkAuth, deleteTask);

router.post('state/:id', checkAuth, changeStatus);
export default router;
