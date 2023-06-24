import { initial } from "underscore";
import { generateSearchVector, initialiseClusterAnalysis } from "~/models/embedding-search.server";

export async function loader({ request }){
    const url = new URL(request.url)
    const featureId = url.searchParams.get("featureId")
    const searchString = url.searchParams.get("searchString")

    const searchVectorRes = await generateSearchVector(searchString)
    const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']
    
    const clusterResponse = await initialiseClusterAnalysis(searchVector, featureId, searchString)

    console.log("CLUSTER RESPONSE:", clusterResponse)

    return {clusterResponse: clusterResponse.status}
}