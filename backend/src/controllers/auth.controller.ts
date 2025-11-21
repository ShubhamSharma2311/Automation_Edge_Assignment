import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.signup({ email, password, name });

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({
          error: 'Conflict',
          message: error.message,
        });
      }
      console.error('Error in signup controller:', error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({
          error: 'Unauthorized',
          message: error.message,
        });
      }
      console.error('Error in login controller:', error);
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Error in getCurrentUser controller:', error);
      next(error);
    }
  }
}

export default new AuthController();
