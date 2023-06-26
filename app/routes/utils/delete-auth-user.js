import { deleteAuthorizedUser } from "~/models/user.server"

export async function action({ request }){
    const formData = await request.formData()

    const authUserId = formData.get('authUserId')

    const authUser = await deleteAuthorizedUser(authUserId)

    return { authUser }
}