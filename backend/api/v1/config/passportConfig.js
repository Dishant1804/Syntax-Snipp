import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
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
    done(null, { user, token: accessToken });
  } 
  catch (error) {
    done(error, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  try {
    let user = await prisma.user.findFirst({ 
      where: {
        githubId: profile.id
      }
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: profile.displayName,
          email: profile.emails[0].value,
          githubId: profile.id
        }
      });
    }

    done(null, { user });
  } catch (error) {
    done(error, null);
  }
}));

export default passport;