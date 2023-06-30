import { setPinned } from "~/models/feature-requests.server";

export async function loader({ request }){
  const url = new URL(request.url)

  const featureId = url.searchParams.get("featureId")
  const fr_id = url.searchParams.get("fr_id")
  const pinnedStatus = url.searchParams.get("pinnedStatus")

  const newPinned = await setPinned(fr_id, featureId, pinnedStatus)

  return newPinned
}
