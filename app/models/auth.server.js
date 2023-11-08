import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/models/session.server";
import { GoogleStrategy, SocialsProvider } from "remix-auth-socials";
import { db } from "~/models/db.server"

// Create an instance of the authenticator
// It will take session storage as an input parameter and creates the user session on successful authentication
export const authenticator = new Authenticator(sessionStorage);

async function handleSocialAuthCallback({ profile }) {
  console.log("HI!!", profile)

  const specialEmails = {
    'andre@uni.minerva.edu': "foundingTeam",
    'finn.james.macken@gmail.com': "foundingTeam",
  }

  const exampleDatasetLinks = {
    'foundingTeam': [114]
  }

  // create user in your db here
  // profile object contains all the user data like image, displayName, id
  const existingUser = await db.user.findUnique({
      where: {
        id: profile.id,
      },
    });

  console.log("EXISTING USER:", existingUser)

  if (!existingUser) {
    // User doesn't exist, so create the user and the Link

    const newUser = await db.user.create({
      data: {
        id: profile.id, // Replace with the user's email
        email: profile.emails[0]['value'], // Replace with the user's name
      },
    });

    if(specialEmails[profile.emails[0]['value']] !== undefined){{
      const linkConnectionArray = exampleDatasetLinks[specialEmails[profile.emails[0]['value']]].map(datasetId => { return {
        datasetId: datasetId,
        userId: profile.id
        }
      })
  
      const newConnections = await db.exampleDataset.createMany({
        data: linkConnectionArray
      })  
    }
    
    return profile;
    }

    return profile
  }
  else  {
    return profile
}
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

