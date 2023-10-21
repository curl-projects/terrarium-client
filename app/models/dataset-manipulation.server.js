import { db } from "./db.server";

export async function getDatasets(userId){
    const datasets = await db.dataset.findMany({
        where: {
            user: {
                id: userId
            }
        },
    })
    return datasets
}

export async function updateFeatureDatasets(featureId, selectedDatasets){
    // remove all existing connections first
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