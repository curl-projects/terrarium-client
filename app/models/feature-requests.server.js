import { db } from "~/models/db.server";

export async function findFeatureRequests(featureId){
  // const featureRequests = await db.featureRequest.findMany({
  //   where: {
  //     features: {
  //       some: {
  //         feature: {
  //           id: parseInt(featureId)
  //         }
  //       }
  //     }
  //   },
  //   include: {
  //     featureRequestMap: true
  //   }
  // })

  const featureRequests = await db.featureRequestMap.findMany({
    where: { featureId: parseInt(featureId)},
    include: {
      featureRequest: true
    }
  })

  console.log("FEATURE_REQUEST:", featureRequests)

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
  console.log("MAPPING DELETED!")


  // async function generateMapping(knnIDs, featureId){
  //   return await db.$transaction(async (tx) => {
  //
  //   })
  // }
  // const createTransaction = await generateMapping(knnIDs, featureId)

  // const newMap = await db.feature.update({
  //   where: {
  //     id: parseInt(featureId)
  //   },
  //   data: {
  //     featureRequests: {
  //       create: connectionArray
  //     }
  //   }
  // })
  // console.log("MAPPING CREATED!")
  //
  // const connectionArray = []


  const connectionArray = []

  for(let fr of knnIDs){
    connectionArray.push({ featureRequestId: fr, featureId: parseInt(featureId)})
  }
  console.log("CONNECTION ARRAY CREATED")

  // always explicitly edit the connection model, rather than using nested writes
  const newMap = await db.featureRequestMap.createMany({
    data: connectionArray
  })
  console.log("NEW MAP CREATED!")

  return {}
}

export async function setPinned(fr_id, featureId, pinnedStatus){
  const updated = await db.featureRequestMap.update({
    where: { featureRequestId: fr_id, featureId: featureId },
    data: {
      pinned: pinnedStatus
    }
  })
  return updated
}

export async function getPinned(featureId){
  const pinnedFeatureRequests = await prisma.featureRequestMap.findMany({
    where: {
      feature: {
        id: {
          equals: featureId
        }
      },
      pinned: true
    }
  })

  return pinnedFeatureRequests
}
//
// export async function filterSearchedData(data, knnIDs) {
//   const filteredResults = knnIDs.filter(a => a['score'] > 0.25)
//
//   let dataIDs = filteredResults.map(a => a.id)
//
//   // console.log("DATA:", data)
//
//   const filteredData = data.filter(({ fr_id }) => dataIDs.includes(fr_id))
//
//
//   const sortedFilteredData = filteredData.slice().sort(function(a, b){
//     return dataIDs.indexOf(a.fr_id) - dataIDs.indexOf(b.fr_id)
//   }).map(function(a){
//     const el = filteredResults.find(element => element.id === a.fr_id)
//     return {...a, "score": el.score}
//   })
//
//   return sortedFilteredData
//
//   // console.log("SORTED FILTERED DATA", sortedFilteredData)
// }
