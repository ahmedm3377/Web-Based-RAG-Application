import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import userRoutes from './routes/users';
import { connect } from './db/mongo';
import docsRoutes from './routes/documents';
import { is_authenticated } from './utils/auth';
import cors from 'cors';

const app = express();
connect();

app.use(express.json());
app.use(cors())

app.use('/users', userRoutes);
app.use('/docs', is_authenticated, docsRoutes)

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

// 500 Not Found Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ success:false, error: `An error occured: ${err}` });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});