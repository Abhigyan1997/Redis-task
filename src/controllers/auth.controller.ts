import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10)
    });

    // Return user data (excluding password)
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed. User not found.' 
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed. Invalid password.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET!,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return success response with token
    res.status(200).json({ 
      success: true,
      message: 'Authentication successful. You are now logged in.',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again later.'
    });
  }
};