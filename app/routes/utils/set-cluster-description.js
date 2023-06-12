import { updateClusterDescription } from "~/models/clusters.server"

export async function loader({ request }){
    const url = new URL(request.url)
    const clusterId = url.searchParams.get("clusterId")
    const description = url.searchParams.get("description")
    const updatedCluster = await updateClusterDescription(parseInt(clusterId), description)

    return { updatedCluster }
}