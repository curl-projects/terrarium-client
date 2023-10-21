import { unique } from "underscore";
import { deleteDataset, deleteDatasetEmbeddings, deleteDatasetStorage } from "~/models/dataset-upload.server"

export async function action({ request }){
    const formData = await request.formData();
    const datasetId = formData.get("datasetId")
    const uniqueFileName = formData.get("uniqueFileName")
    try{
        const embeddingsDeletion = await deleteDatasetEmbeddings(uniqueFileName)
        console.log("EMBEDDINGS DELETION:", embeddingsDeletion)
    }
    catch(exc){
        console.log("EMBEDDINGS DELETION EXC:", exc)
    }
    try{
        const response = await deleteDataset(datasetId)
    }
    catch(exc){
        console.log("DATASET OBJECT DOES NOT EXIST", exc)
    }
    return { }
}