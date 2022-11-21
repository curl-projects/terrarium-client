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
      title: "Untitled",
      description: "~~~",
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

export async function updateFeatureTitle(featureId, featureTitle){
  const feature = await db.feature.update({
    where: {
      id: parseInt(featureId)
    },
    data: {
      title: featureTitle
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

  const updatedPositions = []

  columns.map((col, colIdx) =>
    col.items.map((feature, featureIdx) =>
        updatedPositions.push({colIdx: colIdx+1, featureIdx: featureIdx+1})
      )
    )

  const allCols = []

  for(let col of columns){
    allCols.push(...col.items)
  }

  for(let featNum in allCols){
    allCols[featNum] = {...allCols[featNum], ...updatedPositions[featNum]}
  }

  const updatedFeatures = await Promise.all(
    allCols.map(feature => updateFeaturePosition(feature.id, feature.colIdx, feature.featureIdx))
  )
}
