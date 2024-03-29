import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/cookies.js"

export async function loader({ request }){
  const returnTo = (
    await returnCookie.parse(request.headers.get("Cookie"))
  )

  return authenticator.authenticate(SocialsProvider.GOOGLE, request, {
    successRedirect: `/data-sources-example?code=${returnTo}`,
    failureRedirect: "/",
  });
};
