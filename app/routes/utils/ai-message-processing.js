import { generateAIMessage } from "~/models/ai-messages.server"

export async function action({ request }){

    const formData = await request.formData()
    const messageContent = formData.get("messageContent")
    const featureId = formData.get("featureId")
    const output = await generateAIMessage(messageContent, featureId)
    console.log("ACTION OUTPUT:", output)
    const outputJSON = await output.json()
    console.log("ACTION OUTPUT JSON:", outputJSON)
    return { outputJSON }
}