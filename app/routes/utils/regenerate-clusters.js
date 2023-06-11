import { initial } from "underscore";
import { generateSearchVector, initialiseClusterAnalysis } from "~/models/embedding-search.server";

export async function action({ request }){
    const formData = await request.formData()
    const featureId = formData.get("featureId")
    const searchString = formData.get("searchString")

    const searchVectorRes = await generateSearchVector(searchString)
    const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']
    
    const initialisedClusters = await initialiseClusterAnalysis(searchVector, featureId)

    return {initialisedClusters}
}