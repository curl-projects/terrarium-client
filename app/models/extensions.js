import { db } from "~/models/db.server"

export async function getPossibleFeatures(){
    const possibleFeatures = await db.possibleFeature.findMany({
        where: {
            status: "approved"
        },
        include: {
            users: true
        }
    })
    
    return possibleFeatures
}

export async function getUsersPossibleFeatures(userId){
    const possibleFeatures = await db.possibleFeature.findMany({
        where: {
            authorId: userId
        },
        include: {
            users: true
        }
    })

    return possibleFeatures
}

export async function upvoteFeature(possibleFeatureId, userId){
    const possibleFeature = await db.possibleFeature.update({
        where: {
            possibleFeatureId: parseInt(possibleFeatureId)
        },
        data: {
            upvotes: {
                increment: 1
            },
            users: {
                connect: {
                    id: userId
                }
            }
        }
    })

    return possibleFeature
}

export async function removeUpvote(possibleFeatureId, userId){
    const possibleFeature = await db.possibleFeature.update({
        where: {
            possibleFeatureId: parseInt(possibleFeatureId)
        },
        data: {
            upvotes: {
                decrement: 1
            },
            users: {
                disconnect: {
                    id: userId
                }
            }
        }
    })

    return possibleFeature
}

export async function createPossibleFeature(featureType, featureTitle, featureDescription, userId){
    const possibleFeature = await db.possibleFeature.create({
        data: {
            type: featureType,
            title: featureTitle,
            description: featureDescription,
            upvotes: 1,
            authorId: userId

        }
    })

    return possibleFeature
}