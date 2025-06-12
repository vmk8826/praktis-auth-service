import { Request, Response } from 'express';
import { signup, login } from '../../controllers/auth.controllers';
import User from '../../models/User.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../../models/User.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    req = {
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
  });

  describe('signup', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Test User' }; // Missing email and password
      
      await signup(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Some fields are missing' });
    });
    
    it('should return 400 if user already exists', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      
      (User.findOne as jest.Mock).mockResolvedValueOnce({ _id: '123', email: 'test@example.com' });
      
      await signup(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
    
    it('should create a new user successfully', async () => {
      req.body = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');
      
      const mockUser = { 
        _id: '123', 
        name: 'Test User', 
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      (User.create as jest.Mock).mockResolvedValueOnce(mockUser);
      (jwt.sign as jest.Mock).mockReturnValueOnce('test-token');
      
      await signup(req as Request, res as Response);
      
      expect(res.cookie).toHaveBeenCalledWith('token', 'test-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        token: 'test-token',
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: 'test@example.com' }; // Missing password
      
      await login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
    });
    
    it('should return 401 if user does not exist', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (User.findOne as jest.Mock).mockResolvedValueOnce(null);
      
      await login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
    
    it('should return 401 if password is invalid', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      (User.findOne as jest.Mock).mockResolvedValueOnce({
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword'
      });
      
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
      
      await login(req as Request, res as Response);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });
    
    it('should login successfully with valid credentials', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      
      const mockUser = { 
        _id: '123', 
        name: 'Test User', 
        email: 'test@example.com',
        password: 'hashedPassword'
      };
      
      (User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (jwt.sign as jest.Mock).mockReturnValueOnce('test-token');
      
      await login(req as Request, res as Response);
      
      expect(res.cookie).toHaveBeenCalledWith('token', 'test-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'test-token',
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
      });
    });
  });
}); 