import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.signup({ email, password, name });

      // Set token in HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true, // Always require HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        data: { user: result.user },
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

      // Set token in HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: true, // Always require HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        data: { user: result.user },
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      });

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      console.error('Error in logout controller:', error);
      next(error);
    }
  }
}

export default new AuthController();
