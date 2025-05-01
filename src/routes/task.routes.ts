import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controllers/task.controller';
import { validateCreateTask } from '../validators/task.validator';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.use(authenticate);
router.get('/get_all_task', getAllTasks);
router.post('/create_task',validateCreateTask, validateRequest,  createTask);
router.get('/get/:id', getTaskById);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', authorize(['admin']), deleteTask);

export default router;
