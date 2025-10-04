import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { requireAuth } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/signup',
  body('email').isEmail(),
  body('name').isString().isLength({ min: 1 }),
  body('password').isString().isLength({ min: 6 }),
  validateRequest,
  async (req, res) => {
    const { email, name, password } = req.body as { email: string; name: string; password: string };

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, passwordHash });

    const token = createToken(user.id, user.email);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name } });
  }
);

authRouter.post('/login',
  body('email').isEmail(),
  body('password').isString(),
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken(user.id, user.email);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  }
);

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.auth!.userId).select('id email name');
  res.json({ user });
});

function createToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
}
