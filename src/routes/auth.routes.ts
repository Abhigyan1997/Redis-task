import express from 'express';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

// Register a new user
router.post('/register', register);
// Login a user
router.post('/login', login);

export default router;
