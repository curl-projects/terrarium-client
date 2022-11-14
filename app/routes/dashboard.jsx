import { useEffect } from "react";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { authenticator } from "~/models/auth.server.js";
import { authenticateNotionCode, createNotionAuth,
         readNotionAuth, addGuildAndUsers, readDiscordUsers } from "~/models/notion.server"


const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

const BUTTON_STYLES = {
  padding: "15px 25px",
  background: "#dd4b39",
  border: "0",
  outline: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
}

export const loader = async ({ request }) => {
  // authenticator.isAuthenticated function returns the user object if found
  // if user is not authenticated then user would be redirected back to homepage ("/" route)
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  // console.log("USER", user)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")===null ? 'null' : url.searchParams.get("code")

  // console.log("CODE!", code, code==="null")

  if(code !== "null"){
    const notionResponse = await authenticateNotionCode(code)
    console.log("NOTION RESPONSE:", notionResponse)
    if(notionResponse.error){
      console.log("NOTION ERROR!")
    }
    else{
      const notionAuth = await createNotionAuth(notionResponse, user.id)
      console.log("NOTION AUTH:", notionAuth)
    }
  }

  const notionAuth = await readNotionAuth(user.id)

  const discordUsers = await readDiscordUsers(notionAuth[0].botId)
  console.log('DISCORD USERS:', discordUsers)
  return({user: user, notionAuth: notionAuth, discordUsers: discordUsers});
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const botId = formData.get('botId')
  const guildName = formData.get('guildName');
  const discordUsers = formData.get('discordUsers');
  const transaction = await addGuildAndUsers(botId, guildName, discordUsers)
  console.log('FORM DATA:', guildName, discordUsers)
  return { transaction }
}


export default function Dashboard(){
  const loaderData = useLoaderData();
  const actionData = useActionData();

  useEffect(()=>{
    console.log("LOADER DATA", loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("ACTION DATA", actionData)
  }, [actionData])

  return(
    <div style={CONTAINER_STYLES}>
       <h1>You are Logged in</h1>
       <p>{loaderData.user.displayName}</p>
      <Form action="/logout" method="post">
        <button style={BUTTON_STYLES}>Logout</button>
      </Form>

      <Form method="post">
        <input type="hidden" name="botId" value={loaderData.notionAuth[0].botId}></input>
        <input type='text'
               name='guildName'
               placeholder="Guild Name"
               defaultValue={loaderData.notionAuth[0]?.guildName}>
        </input>
        <input type='text'
               name='discordUsers'
               placeholder="Authorized Users"
               defaultValue={loaderData.discordUsers?.map(element=>element.username).join(",")}></input>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
};
