import { json } from "@remix-run/node"
import { db } from "~/models/db.server"

export async function action({request}){
  const header = request.headers.get("Authorization");
  if(!header) return "Error";

  const base64 = header.replace("Basic ", "");

  const [username, password] = Buffer.from(base64, "base64").toString().split(":");

  if(username === process.env.BACKEND_USERNAME && password === process.env.BACKEND_PASSWORD){
    const reqJson = await request.json()
    const guildName = reqJson.guildName


    // CHECK IF WE HAVE AN AUTH ID WITH THE SPECIFIED GUILD NAME
    const user = await db.notionAuth.findMany({
      where: {
            guildName: {
              equals: guildName
            }
      },
      select: {
        accessToken: true
      }
    })

    console.log("USER", user)
    console.log("NOTION AUTH", user[0]['accessToken'])

    if(user === []){
      return json({ success: false, case: ""}, 400);
    }
    else if(user.length === 1){
      return json({ success: true, case: "", notionAuth: user[0]['accessToken']}, 200);
    }


    return json({ success: true, case: ""}, 200);

  }
  else{
    return json({ success: false, case: "" }, 400);
  }

}
