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
  passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
  const { state } = req.query

  try {
    const decodedState = JSON.parse(decodeURIComponent(state));
    const { userId } = decodedState;

    const data = { profile, token: accessToken, userId };
    done(null, data);
  } catch (error) {
    done(error, null);
  }
}));

export default passport;