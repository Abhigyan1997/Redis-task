import { Request, Response } from 'express';
import { Task } from '../models/task.model';
import redisClient from '../utils/redis';

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const key = 'tasks_cache';
    const cachedTasks = await redisClient.get(key);
    
    if (cachedTasks) {
      console.log('✅ Cache hit - serving from Redis');
      return res.json({
        success: true,
        fromCache: true,
        count: JSON.parse(cachedTasks).length,
        data: JSON.parse(cachedTasks)
      });
    }

    console.log('✅ Cache miss - fetching from DB');

    // Build query filters
    const filters: Record<string, any> = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.dueDate) filters.dueDate = req.query.dueDate;

    const tasks = await Task.find(filters)
      .populate('assignedTo', 'name email')
      .lean();

    await redisClient.setEx(key, 60, JSON.stringify(tasks));

    res.json({
      success: true,
      fromCache: false,
      count: tasks.length,
      data: tasks
    });

  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
};


export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email') // Only include necessary fields
      .lean(); // Better performance

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
};
export const createTask = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Create task with only allowed fields
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending' // Default status
    });

    // Clear cache
    await redisClient.del('tasks_cache');

    // Return success response with task data
    res.status(201).json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Task creation failed:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Added validation
    );
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }
    
    await redisClient.del('tasks_cache');
    
    res.json({
      success: true,
      data: task
    });
    
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update task' 
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false,
        message: 'Task not found' 
      });
    }
    
    await redisClient.del('tasks_cache');
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      deletedTaskId: id // Added deleted ID for reference
    });
    
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete task' 
    });
  }
};