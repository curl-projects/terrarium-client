import { embeddingSearch } from "~/models/embedding-search.server";
import { getSearchedFeatureRequests } from "~/models/feature-requests.server";

export async function loader({ request }){
  const url = new URL(request.url)
  const searchTerm = url.searchParams.get("searchTerm")
  const featureId = url.searchParams.get("featureId")
  const knnIDs = await embeddingSearch(searchTerm)
  const featureRequests = await getSearchedFeatureRequests(featureId, knnIDs)

  return { featureRequests }
}
