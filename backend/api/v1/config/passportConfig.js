import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' }); 
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (profile, done) => {
  try {
    let user = await prisma.user.findFirst({ 
      where: { 
        googleId: profile.id 
      }
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        }
      });
    }
    const token = createToken(user.id);
    done(null, { user, token });
  } catch (error) {
    done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
}, async (profile, done) => {
  try {
    let user = await prisma.user.findFirst({ 
      where: {
        githubId: profile.id
      }
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: profile.username,
          email: profile.emails[0].value,
          githubId: profile.id
        }
      });
    }
    const token = createToken(user.id);
    done(null, { user, token });
  } catch (error) {
    done(error, null);
  }
}));

export default passport;