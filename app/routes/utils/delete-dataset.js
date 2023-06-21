import { deleteDataset, deleteDatasetStorage } from "~/models/dataset-upload.server"

export async function action({ request }){
    const formData = await request.formData();
    const datasetId = formData.get("datasetId")
    const uniqueFileName = formData.get("uniqueFileName")

    const response = await deleteDataset(datasetId)
    const googleResponse = await deleteDatasetStorage(uniqueFileName)

    return { response }
}