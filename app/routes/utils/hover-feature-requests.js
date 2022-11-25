import { findFeatureRequests } from "~/models/feature-requests.server"

export async function loader({ request }){
  const url = new URL(request.url)
  const featureId = url.searchParams.get("featureId")

  const featureRequests = await findFeatureRequests(featureId)
  return { featureRequests }
}
