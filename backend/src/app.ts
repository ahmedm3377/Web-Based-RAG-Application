import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/users';
import { connect } from './db/mongo';


const app = express();
connect();

app.use(express.json());

app.use('/users', userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening at http://localhost:${process.env.PORT}`);
});