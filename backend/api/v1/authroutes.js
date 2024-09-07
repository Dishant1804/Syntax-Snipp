import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const router = express.Router();

router.use(helmet());

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  const saltRounds = 12;

  const passwordHash = await hash(password, saltRounds);

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash: passwordHash
      }
    });

    return res.json({ "Message": "Sign-up Successful" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ "error": e.message });
  }
});

router.post('/signin', signInLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        passwordHash: true
      }
    });

    if (!user) {
      return res.status(401).json({ "message": "Invalid Credentials" });
    }

    const isPasswordValid = await compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ "message": "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    return res.json({ "message": "Sign-in Successful", "token": token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
});

export default router;