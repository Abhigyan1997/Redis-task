import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/task.controller';
import { validateCreateTask } from '../validators/task.validator';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.use(authenticate);
//Create a new task
router.post('/create_task',validateCreateTask, validateRequest,  createTask);
//Get all tasks
router.get('/get_all_task', getAllTasks);
//Get a task by ID
router.get('/get/:id', getTaskById);
//Update a task
router.put('/update/:id', updateTask);
//Delete a task
router.delete('/delete/:id', authorize(['admin']), deleteTask);

export default router;
