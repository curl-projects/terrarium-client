import { db } from "~/models/db.server";

export async function getAIMessages(featureId){
    const aiMessages = await db.aIMessage.findMany({
        where: { featureId: parseInt(featureId) },
        include: {
            featureRequests: {
                include: {
                    features: {
                        where: {
                            featureId: parseInt(featureId)
                        }
                    }
                    }
            }, 
        }
    })

    return aiMessages

}

export async function saveUserMessage(messageContent, featureId){
    const message = await db.aIMessage.create({
        data: {
            content: messageContent,
            agent: "user",
            feature: {

                connect: {
                    id: parseInt(featureId)
                }
            }

        }
    })

    return message
}