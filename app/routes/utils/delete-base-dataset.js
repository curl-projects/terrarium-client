import { deleteBaseDataset, deleteDataset, deleteDatasetEmbeddings, deleteDatasetStorage } from "~/models/dataset-upload.server"

export async function action({ request }){
    const formData = await request.formData();
    const baseDatasetId = formData.get("baseDatasetId")
    const datasets = formData.get("datasets")
    const uniqueFileName = formData.get("uniqueFileName")

    const jsonDatasets = JSON.parse(datasets)

    console.log("BASE DATASET:", baseDatasetId, uniqueFileName)
    console.log("DATASETS:", JSON.parse(datasets))

    for(let dataset of jsonDatasets){
        try{
            const embeddingsDeletion = await deleteDatasetEmbeddings(dataset.datasetId)
            console.log("EMBEDDINGS DELETION:", embeddingsDeletion)
        }
        catch(exc){
            console.log("EMBEDDINGS DELETION EXC:", exc)
        }
        try{
            const response = await deleteDataset(dataset.datasetId)
        }
        catch(exc){
            console.log("DATASET OBJECT DOES NOT EXIST", exc)
        }

        const googleResponse = await deleteDatasetStorage(dataset.uniqueFileName)
    }

    const deletedBaseDataset = await deleteBaseDataset(baseDatasetId)

    return { deletedBaseDataset }
}