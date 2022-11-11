import { authenticator } from "~/models/auth.server.js";
import { SocialsProvider } from "remix-auth-socials";
import { returnCookie } from "~/cookies.js"

export const loader = ({ request }) => login(request);
export const action = ({ request }) => login(request);

async function login(request){
  const url = new URL(request.url)
  const code = url.searchParams.get("code")

  console.log("CODE", code)

  try{
    return await authenticator.authenticate(SocialsProvider.GOOGLE, request, {
      successRedirect: "/dashboard",
      failureRedirect: "/",
    });
  }
  catch (error){
    console.log("ERROR!")
    if(!code) throw error;
    if(error instanceof Response && isRedirect(error)){
      error.headers.append(
        "Set-Cookie",
        await returnCookie.serialize(code)
      );
      return error
    }
    throw error;
  }
}

function isRedirect(response){
  if (response.status < 300 || response.status >= 400) return false;
  return response.headers.has("Location")
}
