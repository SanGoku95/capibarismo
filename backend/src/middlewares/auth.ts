import type { Request, Response, NextFunction } from 'express';

export interface AuthConfig {
  token: string;
}

export class AuthMiddleware {
  constructor(private config: AuthConfig) {}

  validate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'Authorization header is required'
      });
      return;
    }

    // Support both "Bearer <token>" and "<token>" formats
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (token !== this.config.token) {
      res.status(403).json({
        success: false,
        error: 'Invalid authorization token'
      });
      return;
    }

    next();
  };
}

export function createAuthMiddleware(): AuthMiddleware {
  const authToken = process.env.AUTH_TOKEN;

  if (!authToken) {
    throw new Error('AUTH_TOKEN environment variable not set');
  }

  return new AuthMiddleware({ token: authToken });
}
