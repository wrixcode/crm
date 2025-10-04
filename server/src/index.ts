import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import createError from 'http-errors';

import { connectToDatabase } from './utils/mongo';
import { authRouter } from './routes/auth';
import { clientsRouter } from './routes/clients';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV ?? 'development' });
});

app.use('/api/auth', authRouter);
app.use('/api/clients', clientsRouter);

app.use((_req, _res, next) => {
  next(createError(404));
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const port = Number(process.env.PORT || 4000);

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database', error);
    process.exit(1);
  });
