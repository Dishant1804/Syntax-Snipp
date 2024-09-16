import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
}, async ( accessToken, refreshToken, profile, done) => {

  try {
    const data = { profile };
    done(null, data);
  }
  catch (error) {
    done(error, null);
  }
}));


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/github/callback`,
}, async (accessToken, refreshToken, profile, done) => {

  try {
    done(null,  { profile, token: accessToken });
  } catch (error) {
    done(error, null);
  }
}));

export default passport;