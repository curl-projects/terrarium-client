import { db } from "~/models/db.server"

export async function getDatabaseUser(userId){
  const user = await db.user.findUnique({
    where: {
      id: userId
    }
  })
  return user
}

export async function createAuthorizedUser(platform, community, username, userId){
  const authorizedUser = await db.authorizedUser.create({
    data: {
      platform: platform,
      community: community,
      username: username,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
  return authorizedUser
}

export async function getAuthorizedUsers(userId){
  const authorizedUsers = await db.authorizedUser.findMany({
    where: {
      user: {
        id: userId
      }
    }
  })

  return authorizedUsers
}

export async function deleteAuthorizedUser(authUserId){
  const authUser = await db.authorizedUser.delete({
    where: {
      authUserId: parseInt(authUserId)
    }
  })

  return authUser
}