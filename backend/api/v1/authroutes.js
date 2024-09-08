import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import authMiddleware from './middleware/authMiddleware.js';

const router = express.Router();

router.use(helmet());

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 12;

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts. Please try again later.",
});

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

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

router.patch('/updateprofile', authMiddleware, signInLimiter, async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.userId;

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: userId,
      }
    });

    if (!userToUpdate) {
      return res.status(404).json({ "error": "User not found" });
    }

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ "error": "Email already in use" });
      }
      updateData.email = email;
    }

    if (password) {
      const saltRounds = 12; 
      updateData.passwordHash = await hash(password, saltRounds);
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return res.status(200).json({ "message": "User profile updated successfully" });
    } 
    else {
      return res.status(400).json({ "error": "No changes to update" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

router.get('/user/profile', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        email: true,
      }
    });

    if (!user) {
      return res.status(404).json({ "error": "User not found" });
    }

    return res.status(200).json({ 
      message: "Profile retrieved successfully",
      profile: user 
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

export default router;