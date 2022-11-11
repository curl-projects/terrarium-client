import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/cookies.js"

export async function loader({ request }){
  const returnTo = (
    await returnCookie.parse(request.headers.get("Cookie"))
  )

  console.log("RETURN TO", request)

  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: `/dashboard?code=${returnTo}`,
    failureRedirect: "/",
  });
};
