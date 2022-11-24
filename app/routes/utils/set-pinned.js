import { setPinned } from "~/models/feature-requests.server";

export async function action({ request }){
  const formData = await request.formData();
  const featureId = formData.get("featureId")
  const fr_id = formData.get("fr_id")
  const pinnedStatus = formData.get("pinnedStatus")

  const newPinned = await setPinned(fr_id, featureId, pinnedStatus)

  return newPinned
}
