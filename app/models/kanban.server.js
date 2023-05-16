import { db } from "~/models/db.server";
import { deleteTextBox, createTextBox } from "~/models/text-box.server"

export async function getFeatures(userId){
  const features = await db.feature.findMany({
    where: {
      user: {
        is: {
          id: userId
        }
      }
    },
    include: {
      _count: {
        select: {
          featureRequests: {
            where: {
              pinned: true
              }
            }
          }
        }
    }
  })
  return features
}

export async function getPinnedFeatureRequests(userId){
  // get all pinned feature requests and their associated topics
  const pinnedRequests = await db.feature.findMany({
    where: {
      user: {
        is: {
          id: userId
        }
      }
    },
    include: {
      featureRequests: {
        where: {
          pinned: true
        },
        include: {
          featureRequest: {
            select: {
              fr: true,
              author: true
            }
    
          }
        }
      }
    }
  })

  return pinnedRequests
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


  const textData = await createTextBox(feature.id)

  return feature
}

export async function deleteFeature(featureId){
  const textBox = await deleteTextBox(featureId)

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
      title: featureTitle,
    }
  })
  return feature
}

export async function updateFeatureIsSearched(featureId){
  const feature = await db.feature.update({
    where: {
      id: parseInt(featureId)
    },
    data: {
      isSearched: true
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

export async function readFeature(featureId){
  const feature = await db.feature.findUnique({
    where: {
      id: parseInt(featureId)
    }
  })
  return feature
}
