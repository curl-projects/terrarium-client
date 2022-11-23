import { db } from "~/models/db.server";

export async function readFeatureRequests(userId){
  const featureRequests = await db.featureRequest.findMany({
    where: {
      userId: userId
    }
  })

  return featureRequests
}

export async function filterSearchedData(data, knnIDs) {
  const filteredResults = knnIDs.filter(a => a['score'] > 0.25)

  let dataIDs = filteredResults.map(a => a.id)

  // console.log("DATA:", data)

  const filteredData = data.filter(({ fr_id }) => dataIDs.includes(fr_id))


  const sortedFilteredData = filteredData.slice().sort(function(a, b){
    return dataIDs.indexOf(a.fr_id) - dataIDs.indexOf(b.fr_id)
  }).map(function(a){
    const el = filteredResults.find(element => element.id === a.fr_id)
    return {...a, "score": el.score}
  })

  return sortedFilteredData

  // console.log("SORTED FILTERED DATA", sortedFilteredData)
}
