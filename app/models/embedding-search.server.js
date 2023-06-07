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

export async function initialiseClusterAnalysis(searchVector){
  let url = "https://finnianmacken--terrarium-machine-learning-process-clusters-dev.modal.run"

  let data = {
    'search_vector': searchVector
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function embeddingSearch(searchString){
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']

  // asynchronous processing
  const clusterRes = await initialiseClusterAnalysis(searchVector)
  console.log("CLUSTER INFO:", clusterRes)
  // end asynchronous processing

  const knn = await getKNNfromSearchVector(searchVector, topK=100)
  const knnIDs = knn.matches
  const filteredEmbeddings = await filterEmbeddings(knnIDs)
  return filteredEmbeddings
}
