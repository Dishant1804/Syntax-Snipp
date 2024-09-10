import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import authMiddleware from './middleware/authMiddleware.js';
import { z } from 'zod';
import passport from './config/passportConfig.js';

const router = express.Router();

router.use(helmet());
router.use(passport.initialize());

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 12;

const userSignupSchema = z.object({
  username : z.string().toLowerCase().max(50).min(3),
  email : z.string().email(),
  password : z.string().min(8).max(50) 
});

const userSigninSchema = z.object({
  email : z.string().email(),
  password : z.string().min(8).max(50)
})

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many attempts. Please try again later.",
});

const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

router.post('/signup', async (req, res) => {
  const body = req.body;

  const validation = userSignupSchema.safeParse(body);

  if(!validation.success){
    return res.status(401).json({"message" : "Enter proper credentials"});
  }

  const passwordHash = await hash(req.body.password, saltRounds);

  try {
    const test =  await prisma.user.create({
      data: {
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        passwordHash: passwordHash
      }
    });

    return res.json({ "Message": "Sign-up Successful" , "test contents" : test });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ "error": e.message });
  }
});

router.post('/signin', signInLimiter, async (req, res) => {
  const body = req.body;
  const validation = userSigninSchema.safeParse(body);

  if(!validation.success){
    return res.status(401).json({"message" : "Enter proper credentials"});
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      },
      select: {
        id: true,
        passwordHash: true
      }
    });

    if (!user) {
      return res.status(401).json({ "message": "Invalid Credentials" });
    }

    const isPasswordValid = await compare(req.body.password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ "message": "Invalid Credentials" });
    }

    const token = createToken(user.id)
    return res.json({ "message": "Sign-in Successful", "token": token });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.json({ message: "Google authentication successful", token: req.user.token });
  }
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    res.json({ message: "GitHub authentication successful", token: req.user.token });
  }
);

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