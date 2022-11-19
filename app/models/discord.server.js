import { db } from "~/models/db.server"

export async function updateDiscordBot(userId){
  const updatedUser = await db.user.update({
    where: { id: userId},
    data: {
      discordBotAuth: true
    }
  })

  return updatedUser
}
