import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/utils/cookies.js"

export async function loader({ request }){
  let returnTo = (
    await returnCookie.parse(request.headers.get("Cookie"))
  )

  console.log("RETURN TO", returnTo)

  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: `/dashboard?code=${returnTo}`,
    failureRedirect: "/",
  });
};
