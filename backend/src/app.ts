import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import userRoutes from './routes/users';
import { connect } from './db/mongo';
import cors from 'cors'



const app = express();
connect();
app.use(cors());

app.use(express.json());

app.use('/users', userRoutes);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

// 500 Not Found Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ success:false, error: 'An error occured, please  try again!' });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});