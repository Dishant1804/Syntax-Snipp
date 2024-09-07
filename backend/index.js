import express from 'express';
import authRoutes from './api/v1/authroutes.js';
import snippetRoutes from './api/v1/snippetroutes.js'

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/snippet' , snippetRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});