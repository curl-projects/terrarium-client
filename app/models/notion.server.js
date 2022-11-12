import axios from 'axios';

export async function authenticateNotionCode(code){
  const config = {
    method: "post",
    url: "https://api.notion.com/v1/oauth/token",
    auth: {
      username: process.env.NOTION_CLIENT_ID,
      password: process.env.NOTION_CLIENT_SECRET
    },
    data: {
      grant_type: "authorization_code",
      code: code,
    },
    headers: { "Content-Type": "application/json"}
  }

  const response = await axios(config)

  const jsonResponse = await response.json()
  return jsonResponse
}
