import { updateDiscordBot } from "~/models/discord.server"


export async function action({ request }){
  const formData = await request.formData();
  const userId = formData.get("userId")

  const updatedUser = await updateDiscordBot(userId)
  console.log("UPDATED USER", updatedUser)
  return null
}
