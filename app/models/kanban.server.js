import { db } from "~/models/db.server";

export async function getFeatures(userId){
  const features = await db.feature.findMany({
    where: {
      user: {
        is: {
          id: userId
        }
      }
    }
  })
  return features
}

export async function createFeature(userId, columnState, rankState){
  const feature = await db.feature.create({
    data: {
      title: "Placeholder Title",
      description: "Placeholder Desription",
      columnState: parseInt(columnState),
      rankState: parseInt(rankState),
      user: {
        connect: {id: userId}
      }
    }
  })
  return feature
}

export async function deleteFeature(featureId){
  const feature = await db.feature.delete({
    where: {
      id: parseInt(featureId)
    }
  })
  return feature
}

export async function updateFeaturePosition(featureId, columnState, rankState){
  const feature = await db.feature.update({
    where: {
      id: parseInt(featureId)
    },
    data: {
      columnState: columnState,
      rankState: rankState
    }
  })
  return feature
}

export async function updateAllFeaturePositions(columns){
  await columns.map(async(col, colIdx) =>
    await col.items.map(async(feature, featureIdx) =>
      await updateFeaturePosition(feature.id, colIdx+1, featureIdx+1)
    )
  )
}
