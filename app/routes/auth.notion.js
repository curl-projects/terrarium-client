import { authenticator } from "~/models/auth.server.js";
import { redirect } from "@remix-run/node"
import { SocialsProvider } from "remix-auth-socials";

export const loader = async({ request }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  console.log("CODE!", code)
  const user = await authenticator.isAuthenticated(request)
  console.log("USER", user)
  console.log("DATA", request)
  return redirect(`/auth/google?code=${code}`)
}
