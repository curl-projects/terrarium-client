import { respondToMessage } from "~/models/ai-logic.server"

export async function action({ request }){

    const formData = await request.formData()
    const messageContent = formData.get("messageContent")
    const featureId = formData.get("featureId")
    const output = await respondToMessage(messageContent, featureId)
    console.log("OUTPUT:", output)
    return { output }
}