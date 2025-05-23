import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

passport.use('google-dashboard' , new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/dashboard/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const data = { profile };
    done(null, data);
  }
  catch (error) {
    done(error, null);
  }
}));

passport.use('google-vscode' , new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/vscode/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const data = { profile };
    done(null, data);
  }
  catch (error) {
    done(error, null);
  }
}));


passport.use('github-dashboard',  new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/github/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      const userResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const emails = await userResponse.json();
      const primaryEmail = emails.find(email => email.primary);
      if (primaryEmail) {
        profile.emails = [{ value: primaryEmail.email }];
      }
    }

    done(null, { profile, token: accessToken });
  } catch (error) {
    done(error, null);
  }
}));

passport.use('github-vscode', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID_EXTENSION,
  clientSecret: process.env.GITHUB_CLIENT_SECRET_EXTENSION,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/github/vscode/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      const userResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const emails = await userResponse.json();
      const primaryEmail = emails.find(email => email.primary);
      if (primaryEmail) {
        profile.emails = [{ value: primaryEmail.email }];
      }
    }

    done(null, { profile, token: accessToken });
  } catch (error) {
    done(error, null);
  }
}));

export default passport;