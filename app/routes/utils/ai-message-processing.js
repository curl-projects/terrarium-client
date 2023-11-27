import { generateAIMessage, saveUserMessage, saveAIMessage } from "~/models/ai-messages.server"

export async function action({ request }){
    try{
    const formData = await request.formData()
    const messageContent = formData.get("messageContent")
    const featureId = formData.get("featureId")

    saveUserMessage(messageContent, featureId)

    const aiMessageOutput = await generateAIMessage(messageContent, featureId)
    const outputJSON = await aiMessageOutput.json()
    console.log("ACTION OUTPUT JSON:", outputJSON)

    const aiMessage = await saveAIMessage(outputJSON.output, featureId, outputJSON.sources)
    return { outputJSON }
    }
    catch(error){
        console.log("ERROR:", error)
        return {}
    }
}