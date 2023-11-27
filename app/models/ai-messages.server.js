import { RiContactsBookLine } from "react-icons/ri";
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

async function getPinnedFRsAndEmbeddings(featureId){
    const pinnedFRs = await db.featureRequestMap.findMany({
      where: {
        AND: {
          featureId: parseInt(featureId),
          pinned: true
        }
      },
      select: {
        featureRequestId: true
      }
    })
  
    return pinnedFRs
  }

  
export async function generateAIMessage(messageContent, featureId){
    let url = process.env.AI_MESSAGE_URL

    const pinnedFRs = await getPinnedFRsAndEmbeddings(featureId)

    let data = {
        'message_content': messageContent,
        'feature_id': featureId,
        'pinned_frs': pinnedFRs
    }


    try{
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        return res
    }
    catch(exc){
        console.log("Server Exception:", exc)
        return { status: 404 }
    }
}