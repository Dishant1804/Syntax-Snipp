const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get('/helloworld', (_req, res) => {
  res.send('hello world');
}
);

app.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;

  const user = await prisma.user.create({
    data: {
      name: name,
      username: username,
      password: password
    }
  });

  res.json(user);
} );  
