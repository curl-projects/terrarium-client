import { db } from "~/models/db.server";

export async function findFeatureRequests(featureId){
  const featureRequests = await db.featureRequestMap.findMany({
    where: { featureId: parseInt(featureId)},
    include: {
      featureRequest: true,
      cluster: {
        include: {
          clusterTags: true
        }
      }
    }
  })

  return featureRequests
}

export async function getAllActiveFeatureRequests(userId){
  const featureRequests = await db.featureRequest.findMany({
    where: {
      AND: {
        user: {
          id: userId
        },
        features: {
          some: {}
        }
      }
    }
  })
  return featureRequests
}

export async function associateFeatureRequestsWithFeature(knnIDs, featureId){
  // DELETE EXISTING MAPPING
  const deletedConnections = await db.feature.update({
    data: {
      featureRequests: {
        deleteMany: {},
      }
    },
    where: {
      id: parseInt(featureId)
    }
  })


  const connectionArray = []

  for(let fr of knnIDs){
    connectionArray.push({ featureRequestId: fr, featureId: parseInt(featureId)})
  }

  // always explicitly edit the connection model, rather than using nested writes
  const newMap = await db.featureRequestMap.createMany({
    data: connectionArray
  })

  // TODO add scores


  return {}
}

export async function setPinned(fr_id, featureId, pinnedStatus){
  const updated = await db.featureRequestMap.update({
    where: { featureId_featureRequestId: {featureRequestId: fr_id, featureId: parseInt(featureId) }},
    data: {
      pinned: JSON.parse(pinnedStatus)
    }
  })
  return updated
}

export async function deleteOldRequests(){
  const deleted = await db.featureRequest.deleteMany({
    where: {
      fr_id: {
        contains: "/"
      }
    }
  })
  return deleted
}

export async function getSearchedFeatureRequests(featureId, knnIDs){
  const featureRequests = await db.featureRequestMap.findMany({
    where: {AND: [
        { featureRequestId: { in: knnIDs }},
        { featureId: parseInt(featureId)}
    ]},
    include: {
      featureRequest: true
    }
  })

  return featureRequests
}