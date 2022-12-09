import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/models/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { db } from "~/models/db.server"

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage);

async function handleSocialAuthCallback({ profile }) {
  // create user in your db here
  // profile object contains all the user data like image, displayName, id
  const user = await db.user.upsert({
    where: { id: profile.id },
    update: { },
    create: { id: profile.id, email: profile.emails[0]['value'] }
  })
  return profile;
}

// Configuring Google Strategy
authenticator.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: ["openid email profile"],
    callbackURL: `${process.env.DOMAIN}auth/${SocialsProvider.GOOGLE}/callback`,
  },
  handleSocialAuthCallback
));
