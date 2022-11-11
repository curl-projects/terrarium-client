// file: app/routes/auth.google.callback.js

import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";

export const loader = ({ request }) => {
  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  });
};
