import express from 'express';
import authRoutes from './api/v1/authroutes.js';
import snippetRoutes from './api/v1/snippetroutes.js';
import passport from './api/v1/config/passportConfig.js';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: 'http://localhost:3001', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
  allowedHeaders: ['Content-Type'], 
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/snippet' , snippetRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});