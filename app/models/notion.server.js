import axios from 'axios';
import { db } from "~/models/db.server"

export async function authenticateNotionCode(code){

  const url = "https://api.notion.com/v1/oauth/token"
  const data = {
    "grant_type": "authorization_code",
    "code": code,
    "redirect_uri": "http://localhost:3000/auth/notion"}

  const authToken = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");


  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  const jsonResponse = await response.json()
  return jsonResponse
}

export async function createNotionAuth(notionData, userId){
  console.log("INNER NOTION DATA", notionData)
  const notionAuth = await db.notionAuth.upsert({
    where: { botId: notionData.bot_id},
    update: {
      botId: notionData.bot_id,
      accessToken: notionData.access_token,
      owner: JSON.stringify(notionData.owner),
      duplicatedTemplateId: notionData.duplicated_template_id===null ? "null" : notionData.duplicated_template_id,
      workspaceIcon: notionData.workspace_icon,
      workspaceId: notionData.workspace_id,
      workspaceName: notionData.workspace_name,
      user: {
        connect: {id: userId}
      }
    },
    create: {
      botId: notionData.bot_id,
      accessToken: notionData.access_token,
      owner: JSON.stringify(notionData.owner),
      duplicatedTemplateId: notionData.duplicated_template_id===null ? "null" : notionData.duplicated_template_id,
      workspaceIcon: notionData.workspace_icon,
      workspaceId: notionData.workspace_id,
      workspaceName: notionData.workspace_name,
      user: {
        connect: {id: userId}
      }
    }
  })

  return notionAuth
}

export async function readNotionAuth(userId){
  const notionAuth = await db.notionAuth.findMany({
    where: {
      user: {
        is: {
          id: userId
        }
      }
    }
  })

  return notionAuth
}

export async function addGuildAndUsers(botId, guildName, discordUsers){
  const usersArray = discordUsers.split(",")
  const trimmedUsersArray = usersArray.map(element => {
    return element.trim()
  })
  const formattedUsersArray = trimmedUsersArray.map(element => {
    return { username: element }
  })

  console.log("BOTID", botId)

  // UPDATE GUILD ID
  const updateGuild = db.notionAuth.update({
    where: {
      botId: botId
    },
    data: {
      guildName: guildName
    }
  })

  // DELETE AND CREATE USERS
  const deleteDiscordUsers = db.discordUser.deleteMany({
    where: {
      notionAuth: {
        is: {
          botId: botId
        }
      }
    }
  })

  const createDiscordUsers = db.notionAuth.update({
    where: { botId: botId },
    data: {
      discordUsers: {
        createMany: {
          data: formattedUsersArray
        }
      }
    }
  })

  const transaction = await db.$transaction([updateGuild, deleteDiscordUsers, createDiscordUsers])
  return transaction
}

export async function readDiscordUsers(botId){
  const discordUsers = await db.discordUser.findMany({
    where: {
      notionAuth: {
        is: {
          botId: botId
        }
      }
    },
    select: {
      username: true
    }
  })
  console.log('INNER DISCORD USERS:', discordUsers)
  return discordUsers
}
