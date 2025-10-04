import { Router } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { Client } from '../models/Client';

export const clientsRouter = Router();

clientsRouter.use(requireAuth);

clientsRouter.get('/', async (req, res) => {
  const clients = await Client.find({ userId: req.auth!.userId }).sort({ createdAt: -1 });
  res.json({ clients });
});

clientsRouter.post('/',
  body('name').isString().notEmpty(),
  body('phone').isString().notEmpty(),
  body('source').isString().notEmpty(),
  body('status').isString().notEmpty(),
  body('priority').isString().notEmpty(),
  validateRequest,
  async (req, res) => {
    const payload = req.body;
    const existing = await Client.findOne({ userId: req.auth!.userId, $or: [ { phone: payload.phone }, { email: payload.email } ] });
    if (existing) return res.status(409).json({ message: 'Client already exists' });

    const client = await Client.create({
      ...payload,
      userId: req.auth!.userId,
      createdDate: new Date(),
    });
    res.status(201).json({ client });
  }
);

clientsRouter.get('/:id', async (req, res) => {
  const client = await Client.findOne({ _id: req.params.id, userId: req.auth!.userId });
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json({ client });
});

clientsRouter.put('/:id', async (req, res) => {
  const updates = req.body;
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, userId: req.auth!.userId },
    { ...updates, lastContactedDate: new Date() },
    { new: true }
  );
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json({ client });
});

clientsRouter.delete('/:id', async (req, res) => {
  const result = await Client.deleteOne({ _id: req.params.id, userId: req.auth!.userId });
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Not found' });
  res.status(204).send();
});

clientsRouter.post('/:id/notes',
  param('id').isString().notEmpty(),
  body('note').isString().notEmpty(),
  body('status').isString().notEmpty(),
  body('type').optional().isString(),
  validateRequest,
  async (req, res) => {
    const { note, status, type } = req.body as { note: string; status: string; type?: string };
    const client = await Client.findOne({ _id: req.params.id, userId: req.auth!.userId });
    if (!client) return res.status(404).json({ message: 'Not found' });

    client.notes.push({
      _id: (undefined as any),
      date: new Date(),
      note,
      status: status as any,
      type: (type || 'note') as any,
    } as any);
    client.status = status as any;
    client.lastContactedDate = new Date();

    await client.save();

    res.status(201).json({ client });
  }
);
