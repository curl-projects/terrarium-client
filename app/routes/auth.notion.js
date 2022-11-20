import { authenticator } from "~/models/auth.server.js";
import { redirect } from "@remix-run/node"
import { SocialsProvider } from "remix-auth-socials";
import { sessionStorage } from "~/models/session.server";

export const loader = async({ request }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  const user = await authenticator.isAuthenticated(request)

  if(user){
    await authenticator.logout(request, { redirectTo: `/auth/notion?code=${code}`})
  }
  return redirect(`/auth/google?code=${code}`)
}
