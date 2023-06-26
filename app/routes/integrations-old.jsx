import { useEffect, useState } from "react";
import { useLoaderData, useActionData } from "@remix-run/react";
import { authenticator } from "~/models/auth.server.js";
import { authenticateNotionCode, createNotionAuth,
         readNotionAuth, addGuildAndUsers, readDiscordUsers } from "~/models/notion.server"
import { getDatabaseUser } from "~/models/user.server"
import cn from 'classnames'

import Header from "~/components/Header/Header";

import NotionIntegration from "~/components/Integrations/NotionIntegration"
import DiscordIntegration from "~/components/Integrations/DiscordIntegration"
import UserAuthIntegration from "~/components/Integrations/UserAuthIntegration"

const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};


export const loader = async ({ request }) => {
  // authenticator.isAuthenticated function returns the user object if found
  // if user is not authenticated then user would be redirected back to homepage ("/" route)
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const databaseUser = await getDatabaseUser(user.id)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")===null ? 'null' : url.searchParams.get("code")


  if(code !== "null"){
    const notionResponse = await authenticateNotionCode(code)
    console.log("NOTION RESPONSE:", notionResponse)
    if(notionResponse.error){
      console.log("NOTION ERROR!")
    }
    else{
      const notionAuth = await createNotionAuth(notionResponse, user.id)
    }
  }

  const notionAuth = await readNotionAuth(user.id)

  console.log("NOTION AUTH", notionAuth)
  const discordUsers = notionAuth[0]?.botId ? await readDiscordUsers(notionAuth[0].botId) : []
  console.log('DISCORD USERS:', discordUsers)
  return({user: user, databaseUser: databaseUser, notionAuth: notionAuth, discordUsers: discordUsers});
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const botId = formData.get('botId')
  const guildName = formData.get('guildName');
  const discordUsers = formData.get('discordUsers');
  const transaction = await addGuildAndUsers(botId, guildName, discordUsers)
  return { transaction }
}


export default function Dashboard(){
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const [notionIsAuthenticated, setNotionIsAuthenticated] = useState(false)
  const [usersAreAuthenticated, setUsersAreAuthenticated] = useState(false)
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false)

  useEffect(()=>{
    if(loaderData.notionAuth.length === 0){
      setNotionIsAuthenticated(false)
    }
    else{
      setNotionIsAuthenticated(true)
    }

    if(loaderData.discordUsers.length === 0){
      setUsersAreAuthenticated(false)
    }
    else{
      setUsersAreAuthenticated(true)
    }

  }, [loaderData])

  useEffect(()=>{
    console.log("LOADER DATA", loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("ACTION DATA", actionData)
  }, [actionData])

  return(
    <div style={CONTAINER_STYLES}>
      <Header />
      <div className='integrations'>
        <NotionIntegration notionIsAuthenticated={notionIsAuthenticated} />
        <DiscordIntegration
          databaseUser = {loaderData.databaseUser}
          />
        <UserAuthIntegration
          usersAreAuthenticated={usersAreAuthenticated}
          loaderData={loaderData}
          transaction = {actionData?.transaction ? actionData.transaction : []}
        />

      </div>

    </div>
  );
};
