import { db } from "./db.server";

export async function getRoadmapDatasets(userId){
    const datasets = await db.datasetUserMapping.findMany({
        where: {
            user: {
                id: userId
            }
        },
        include: {
            dataset: true
        }
    })
    return datasets
}

export async function updateFeatureDatasets(featureId, selectedDatasets){
    // remove all existing connections firsta
    const disconnectedFeature = await db.feature.update({
        where: {
            id: parseInt(featureId)
        },
        data: {
            datasets: {
                set: []
            }
        }
    })

    const feature = await db.feature.update({
        where: {
            id: parseInt(featureId)
        },
        data: {
            datasets: {
                connect: selectedDatasets.map(uniqueFileName => ({"uniqueFileName": uniqueFileName}))
            }
        }
    })

    return feature
}

export async function connectDatasetToUser(userId, datasetId){
    // create connection object
    const datasetUserMapping = await db.datasetUserMapping.create({
        data: {
            userId: userId,
            datasetId: datasetId
        }
    })

    return datasetUserMapping
}

export async function disconnectDatasetAndUser(userId, datasetId){
    const datasetUserMapping = await db.datasetUserMapping.delete({
        where: {
            userId: userId,
            datasetId: datasetId
        },
    })

    return datasetUserMapping
}

export async function getUserWithDatasets(userId){
    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            datasets: { 
                include: {
                    dataset: true
                }                  
            }
        }
    })

    return user
}