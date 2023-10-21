import { db } from "./db.server";

const { Configuration, OpenAIApi } = require("openai");

export async function generateSearchVector(searchString){
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });

  const openai = new OpenAIApi(configuration);
  const response = await openai.createEmbedding({ 
    "model": "text-embedding-ada-002",
    "input": searchString,
    "user": "Terrarium"
  })

  return response.data
}

export async function getKNNfromSearchVector(vector, selectedDatasets, topK=1){
  let url = "https:/terrarium-1ce80e9.svc.us-west1-gcp.pinecone.io/query"


  let data = {
    "vector": vector,
    "includeValues": false,
    "filter": {"dataset": {"$in": selectedDatasets}},
    "topK": topK,
    "includeMetadata": true,
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
    const dataIDs = sortedResponses.map(function(a){
      return {id: a.id, score: a.score}
    })
    return dataIDs
  }

export async function initialiseClusterAnalysis(searchVector, featureId, searchString){

  let url = process.env.MACHINE_LEARNING_URL

  let data = {
    'search_vector': searchVector,
    'terrarium_feature_id': featureId,
    'feature_title': searchString
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

export async function getDatasetUniqueNames(userId){
  const datasets = await db.dataset.findMany({
    where: {
      user: {
        id: userId
      }
    },
    select: {
      uniqueFileName: true
    }
  })

  return datasets
}

export async function embeddingSearch(searchString, featureId, userId, selectedDatasets){
  console.log("SELECTED DATASETS", selectedDatasets)

  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']

  // asynchronous processing
  const clusterRes = await initialiseClusterAnalysis(searchVector, featureId, searchString)
  // end asynchronous processing

  const knn = await getKNNfromSearchVector(searchVector, selectedDatasets, topK=100)

  console.log("KNN", knn['matches'][0]['metadata'])
  const knnIDs = knn.matches
  const filteredEmbeddings = await filterEmbeddings(knnIDs)
  return {knnIDs: filteredEmbeddings, pipelineResponse: clusterRes.status}
}