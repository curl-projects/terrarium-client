import { db } from "~/models/db.server";

export async function updateClusterDescription(clusterId, clusterDescription){
    const updatedCluster = await db.cluster.update({
        where: {
            clusterId: clusterId
        },
        data: {
            description: clusterDescription
        }
    })

    return updatedCluster
}