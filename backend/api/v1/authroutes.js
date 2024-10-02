import express from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import authMiddleware from "./middleware/authMiddleware.js";
import { z } from "zod";
import passport from "./config/passportConfig.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 12;

const userSignupSchema = z.object({
  username: z.string().toLowerCase().max(50).min(3),
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

const userSigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: "Too many attempts. Please try again later.",
});

const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

router.post("/signup", signInLimiter, async (req, res) => {
  const body = req.body;

  const validation = userSignupSchema.safeParse(body);

  if (!validation.success) {
    return res
      .status(401)
      .json({ message: "Enter proper credentials", success: false });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use", success: false });
    }

    const passwordHash = await hash(req.body.password, saltRounds);
    const lowerCaseUsername = req.body.username.toLowerCase();

    const user = await prisma.user.create({
      data: {
        username: lowerCaseUsername,
        email: req.body.email,
        passwordHash: passwordHash,
      },
    });

    const token = createToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    return res.status(201).json({ status: "signedup", success: true });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
});

router.post("/signin", signInLimiter, async (req, res) => {
  const body = req.body;
  const validation = userSigninSchema.safeParse(body);

  if (!validation.success) {
    return res
      .status(401)
      .json({ message: "Enter proper credentials", success: false });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", success: false });
    }

    const isPasswordValid = await compare(req.body.password, user.passwordHash);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid Credentials", success: false });
    }

    const token = createToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });
    return res.json({ status: "signedin", success: true });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
});

router.get(
  "/google/dashboard",
  passport.authenticate("google-dashboard", {
    scope: ["profile", "email"],
  }),
);

router.get('/google/vscode', passport.authenticate('google-vscode', {
  scope: ['profile', 'email']
}));


router.get('/google/dashboard/callback', passport.authenticate('google-dashboard', {
  session: false,
  failureRedirect: "/login",
}),
  async (req, res) => {
    try {
      const { profile } = req.user;

      const user = await prisma.user.upsert({
        where: {
          email: profile.emails[0].value,
        },
        update: {
          isGoogle: true,
        },
        create: {
          username: profile.displayName,
          email: profile.emails[0].value,
          isGoogle: true,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get('/google/vscode/callback', passport.authenticate('google-vscode', {
  session: false,
  failureRedirect: "/login",
}),
  async (req, res) => {
    try {
      const { profile } = req.user;

      const user = await prisma.user.upsert({
        where: {
          email: profile.emails[0].value,
        },
        update: {
          isGoogle: true,
        },
        create: {
          username: profile.displayName,
          email: profile.emails[0].value,
          isGoogle: true,
        },
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.redirect(`http://localhost:54321/auth/${token}`);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.get("/github", (req, res, next) => {
  passport.authenticate("github", {
    scope: ["read:user", "user:email"],
  })(req, res, next);
});

router.get('/github/callback', passport.authenticate('github', {
  session: false,
  failureRedirect: "/login",
}),
  async (req, res) => {
    try {
      const { profile, token } = req.user;
      const hashedToken = await hash(token, saltRounds);

      const email =
        profile.emails && profile.emails[0] ? profile.emails[0].value : null;

      let user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            username: profile.username.toLowerCase(),
            email: email,
            passwordHash: hashedToken,
            isGithub: true,
          },
        });
      }

      const newToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.cookie("token", newToken, {
        httpOnly: true,
        sameSite: "lax",
      });
      res.cookie("githubToken", token, {
        httpOnly: true,
        sameSite: "lax",
      });
      res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    } catch (error) {
      console.error("Error linking GitHub account:", error);
      res
        .status(500)
        .json({ error: "Failed to link GitHub account", success: false });
    }
  },
);


router.patch('/updateprofile', signInLimiter, authMiddleware, signInLimiter, async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.userId;

  try {
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userToUpdate) {
      return res
        .status(404)
        .json({ error: "User not found", success: false });
    }

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        return res
          .status(400)
          .json({ error: "Email already in use", success: false });
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

      return res.status(200).json({ status: "updated", success: true });
    } else {
      return res
        .status(400)
        .json({ error: "No changes to update", success: false });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
},
);

router.get("/user/profile", authMiddleware, async (req, res) => {
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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ status: "retrieved", success: true, profile: user });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;

