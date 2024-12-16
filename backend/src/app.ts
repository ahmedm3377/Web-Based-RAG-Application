import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/users';
import { connect } from './db/mongo';
import docsRoutes from './routes/documents';
import { is_authenticated } from './utils/auth';
import cors from 'cors';

const app = express();
connect();

app.use(express.json());
//app.use(cors())

app.use('/users', userRoutes);
app.use('/docs', is_authenticated, docsRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});