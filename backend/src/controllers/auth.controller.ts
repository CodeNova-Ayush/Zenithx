import { Request, Response } from 'express';
import { 
  authenticateUser, 
  registerUser, 
  validateSessionToken, 
  invalidateSession, 
  requestPasswordReset,
  SESSION_COOKIE_NAME 
} from '../services/auth.service';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const session = await authenticateUser({ email, password });

    // Set cookie
    res.cookie(SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ 
      user: session.user,
      token: session.sessionToken,
      message: 'Authenticated successfully' 
    });
  } catch (error: any) {
    console.error('Error in login controller:', error);
    res.status(401).json({ error: error.message || 'Invalid credentials' });
  }
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const session = await registerUser({
      name,
      email,
      password,
    });

    res.cookie(SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ 
      user: session.user,
      token: session.sessionToken,
      message: 'Account registered successfully' 
    });
  } catch (error: any) {
    console.error('Error in signup controller:', error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = (req as any).cookies?.[SESSION_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(200).json({ user: null });
      return;
    }

    const user = validateSessionToken(token);
    res.status(200).json({ user: user || null });
  } catch (error) {
    console.error('Error in me controller:', error);
    res.status(200).json({ user: null });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = (req as any).cookies?.[SESSION_COOKIE_NAME] || req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      invalidateSession(token);
    }

    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const result = requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in forgotPassword controller:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
};
