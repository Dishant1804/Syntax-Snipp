import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import authMiddleware from './middleware/authMiddleware.js'; //update the middleware after changing the schema
import { z } from 'zod';
import passport from './config/passportConfig.js';

const router = express.Router();

router.use(helmet());
router.use(passport.initialize());

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 12;

const userSignupSchema = z.object({
  username: z.string().toLowerCase().max(50).min(3),
  email: z.string().email(),
  password: z.string().min(8).max(50)
});

const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50)
})

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many attempts. Please try again later.",
});

const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * update after schema change
 */
router.post('/signup', async (req, res) => {
  const body = req.body;

  const validation = userSignupSchema.safeParse(body);

  if (!validation.success) {
    return res.status(401).json({ "message": "Enter proper credentials", "success": false });
  }

  const passwordHash = await hash(req.body.password, saltRounds);

  try {
    await prisma.user.create({
      data: {
        username: req.body.username.toLowerCase(),
        email: req.body.email,
        passwordHash: passwordHash
      }
    });

    return res.status(201).json({ "status": "signedup", "success": true });
  }
  catch (e) {
    console.log(e);
    return res.status(400).json({ "error": e.message, "success": false });
  }
});

router.post('/signin', signInLimiter, async (req, res) => {
  const body = req.body;
  const validation = userSigninSchema.safeParse(body);

  if (!validation.success) {
    return res.status(401).json({ "message": "Enter proper credentials", "success": false });
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
      return res.status(401).json({ "message": "Invalid Credentials", "success": false });
    }

    const isPasswordValid = await compare(req.body.password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ "message": "Invalid Credentials", "success": false });
    }

    const token = createToken(user.id)
    return res.json({ "status": "signedin", "token": token, "success": true });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ "message": "Internal Server Error", "success": false });
  }
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * add proper redirect to the required page --> figure out what needs to be changed
 */
router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login'
}),
  (req, res) => {
    res.json({ "status": "Google authentication successful", token: req.user.token, "success": true });
  }
);

router.get('/github', passport.authenticate('github', {
  scope: ['read:user', 'gist']
}));

router.get('/github/callback', passport.authenticate('github', {
  session: false,
  failureRedirect: '/login'
}),
  (req, res) => {
    const { id, username, profileUrl } = req.user.profile
    const accessToken = req.user.token

    const data = {
      id,
      username,
      profileUrl,
      accessToken,
    }

    const encodedData = encodeURIComponent(JSON.stringify(data));

    res.redirect(`http://localhost:3000/api/v1/auth/link-github?data=${encodedData}`);
  }
);

router.get('/link-github', authMiddleware, async (req, res) => {
  const { data } = req.query;
  const userId = req.user.userId;

  if (!data) {
    return res.status(400).json({ error: 'Something went wrong' });
  }

  try {
    const decodedData = JSON.parse(decodeURIComponent(data));
    const { id, username, profileUrl, accessToken } = decodedData;

    const isGithubLinked = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        isGithub: true,
      },
    });

    if (!isGithubLinked?.isGithub) {
      try {
        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            isGithub: true,
            github: {
              create: {
                id,
                username,
                profileUrl,
                accesstoken: accessToken,
              },
            },
          },
          include: {
            github: true,
          },
        });

        if (!updatedUser.github) {
          return res.json({ error: 'Failed to create GitHub profile' });
        }

        const token = jwt.sign({ id: updatedUser.github.id }, JWT_SECRET);
        res.redirect(`http://localhost:3001/dashboard?token=${token}`);
      } 
      catch (updateError) {
        console.error(updateError);
        return res.status(500).json({ error: 'Failed to update GitHub profile' });
      }
    } 
    else {
      return res.json({ success: true, message: 'GitHub already linked' });
    }
  } 
  catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid data format' });
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
      return res.status(404).json({ "error": "User not found", "success": false });
    }

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email
        }
      });

      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ "error": "Email already in use", "success": false });
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

      return res.status(200).json({ "status": "updated", "success": true });
    }
    else {
      return res.status(400).json({ "error": "No changes to update", "success": false });
    }
  }
  catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error", "success": false });
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
        isGoogle: true,
        isGithub: true,
      }
    });

    if (!user) {
      return res.status(404).json({ "error": "User not found", "success": false });
    }

    return res.status(200).json({ "status": "retrieved", "success": true, profile: user });

  }
  catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error", "success": false });
  }
});

export default router;