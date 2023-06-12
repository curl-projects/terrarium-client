import { db } from "./db.server";

const { Configuration, OpenAIApi } = require("openai");

export async function generateSearchVector(searchString){
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const response = await openai.createEmbedding({
    "model": "text-search-babbage-query-001",
    "input": searchString,
    "user": "Terrarium"
  })

  return response.data
}

export async function getKNNfromSearchVector(vector, topK=1){
  let url = "https:/terrarium-1ce80e9.svc.us-west1-gcp.pinecone.io/query"

  let data = {
    "vector": vector,
    "includeValues": false,
    "topK": topK,
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.PINECONE_KEY
    },
    body: JSON.stringify(data)
  })

  return res.json()
  }

export async function filterEmbeddings(knnIDs){
    const filteredResults = knnIDs.filter(a => a['score'] > 0.25)
    const sortedResponses = filteredResults.slice().sort((a,b)=>b-a)
    const dataIDs = sortedResponses.map(a => a.id)
    return dataIDs
  }

export async function initialiseClusterAnalysis(searchVector, featureId){

  // set cluster analysis completion flag to false
  // const feature = await db.feature.update({
  //   where: {
  //     id: parseInt(featureId)
  //   },
  //   data: {
  //     clustersGenerated: false
  //   }
  // })

  let url = process.env.MACHINE_LEARNING_URL

  let data = {
    'search_vector': searchVector,
    'terrarium_feature_id': featureId
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  return res
}

export async function embeddingSearch(searchString, featureId){
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']

  // asynchronous processing
  const clusterRes = await initialiseClusterAnalysis(searchVector, featureId)
  console.log("CLUSTER INFO:", clusterRes)
  // end asynchronous processing

  const knn = await getKNNfromSearchVector(searchVector, topK=100)
  const knnIDs = knn.matches
  const filteredEmbeddings = await filterEmbeddings(knnIDs)
  return filteredEmbeddings
}

// DELETE EXISTING CLUSTERS BELONGING TO A SPECIFIED FEATURE
export async function deleteClusters(featureId){
  const result = await db.feature.update({
    where: {
      id: featureId
    },
    data: {
      clusters: {
        deleteMany: {}
      }
    }
  })
}

// CREATE CLUSTERS AND ATTACH ALL RELEVANT FEATURE REQUESTS
// export async function attachClusters(featureId){
//   const result = await db.feature.update({
//     where: {
//       id: featureId
//     },
//     data: {
//       feature: {
//         connect: {
//           id: 
//         }
//       }
//     }
//   })
// }

export async function createCluster(clusterId, featureId, featureRequestId){
  const result = await db.cluster.create({
    data: {
      clusterId: clusterId,
      feature: {
        connect: {
          id: featureId
        }
      },
      featureRequestMaps: {
        connect: [
          {
            "featureId_featureRequestId": {
              "featureId": int(feature_id),
              "featureRequestId": featureRequestId,
          }
          }
        ]
      }
    }
  })
}


// result = await db.cluster.create(
//   data={
//     clusterId: 1,
//     feature: {
//       connect: {
//         id: 17
//       }
//     },
//     featureRequestMaps: {
//       connect: [
//         {
//           "featureId_featureRequestId": {
//             "featureId": 17,
//             "featureRequestId": "10007167454405100125570276001011828521",
//           }
//         }
//       ]
//     }
//   })

// CONNECT ALL CLUSTERS AT ONCE