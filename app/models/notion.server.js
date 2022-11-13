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

  // const config = {
  //   method: "post",
  //   url: "https://api.notion.com/v1/oauth/token",
  //   auth: {
  //     username: process.env.NOTION_CLIENT_ID,
  //     password: process.env.NOTION_CLIENT_SECRET
  //   },
  //   data: {
  //     grant_type: "authorization_code",
  //     code: code,
  //   },
  //   headers: { "Content-Type": "application/json"}
  // }
  //
  // const response = await axios(config)

  const jsonResponse = await response.json()
  return jsonResponse
}

export async function createNotionAuth(notionData, userId){
  // const notionAuth = await db.notionAuth.upsert({
  //   where: { id: notionData.id},
  //   create: { },
  //   update: {}
  //
  // })

  const notionAuth = await db.notionAuth.create({
    data: {
      id: notionData.id,
      accessToken: notionData.accessToken,
      botId: notionData.botId,
      owner: JSON.stringify(notionData.owner),
      duplicatedTemplateId: notionData.duplicatedTemplateId,
      workspaceIcon: notionData.workspaceIcon,
      workspaceId: notionData.workspaceId,
      workspaceName: notionData.workspaceName,
      user: {
        connect: [{id: userId}]
      }
    }
  })

  return notionAuth
}

async function verifyNotionAccess(discordUsername){

}
