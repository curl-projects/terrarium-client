import { authenticator } from "~/models/auth.server.js";
import { sessionStorage } from "~/models/session.server";
import { returnCookie } from "~/cookies.js"

export const action = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
