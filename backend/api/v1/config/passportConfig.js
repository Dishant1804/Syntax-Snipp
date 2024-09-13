import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const generateJWT = (user) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * change the parameters after schema update
 * check the profile id is it same as user ID?
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findFirst({
      where: {
        id: profile.id
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
    const token = generateJWT(user);
    done(null, { user, token });
  }
  catch (error) {
    done(error, null);
  }
}));

/**
 * change the parameters according to the schema this will act as link to the main account
 * send 2 db calls one patch req to user for isGithub : true and 2nd req to github model to update the contents
 */
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/v1/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  console.log(profile);
  try {
    done(null, { profile , token : accessToken });
  } catch (error) {
    done(error, null);
  }
}));

export default passport;