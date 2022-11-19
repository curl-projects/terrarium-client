import { db } from "~/models/db.server"

export async function getDatabaseUser(userId){
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })
  return user
}
