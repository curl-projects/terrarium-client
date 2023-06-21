import { db } from "./db.server";
import { Storage } from '@google-cloud/storage';
import { PassThrough } from "stream";
import { writeAsyncIterableToWritable } from "@remix-run/node"; // `writeAsyncIterableToWritable` is a Node-only utility
import { json } from "@remix-run/node"
import { Readable } from "stream"


export async function getDatasets(userId){
    const datasets = await db.dataset.findMany({
        where: {
            user: {
                id: userId
            }
        }
    })
    return datasets
}

export async function createDatasetObject(fileName, userId){
  const dataset = await db.dataset.create({
    data: {
        uniqueFileName: fileName,
        user: {
            connect: {
                id: userId
            }
        }
    }
  })

  return dataset
}

export async function initiateDatasetProcessing(fileName, datasetId, userId){
    console.log("Initiated Dataset Processing")

    let url = process.env.DATASET_PROCESSING_URL

    let data = {
      'file_name': fileName,
      'dataset_id': datasetId,
      'user_id': userId
    }
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
  
    return res
  }

export const deleteDatasetStorage = async(uniqueFileName) => {

    const bucketName = "terrarium-fr-datasets";
    const cloudStorage = new Storage({
        projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        credentials: {
            client_email: process.env.GOOGLE_STORAGE_EMAIL,
            private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY
        }
    });

    async function deleteFile(){
        await cloudStorage.bucket(bucketName).file(uniqueFileName).delete()
    }

    deleteFile().catch(console.error)
}

const uploadStreamToCloudStorage = async (stream, fileName) => {
    const bucketName = "terrarium-fr-datasets";
    const filePath = "/"

    const cloudStorage = new Storage({
        projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        credentials: {
            client_email: process.env.GOOGLE_STORAGE_EMAIL,
            private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY
        }
    });

    const uniqueId = Math.random().toString(36).slice(2, 5);

    const uniqueFileName = `${uniqueId}-${fileName}`

    const file = cloudStorage.bucket(bucketName).file(uniqueFileName);

    async function fileUpload(){
        stream.pipe(file.createWriteStream()).on('finish', () => {
            console.log("COMPLETED!")
        });
    }

    fileUpload().catch(console.log)


    return JSON.stringify({fileName: fileName, uniqueFileName: uniqueFileName, completed: true})
};

export const googleUploadHandler = async ({ filename, data }) => {
  const stream = Readable.from(data)
  const upload = await uploadStreamToCloudStorage(stream, filename);
  return upload
};

export async function deleteDataset(datasetId){
    console.log("DATASET ID:", datasetId)

    const response = await db.dataset.delete({
        where: {
            datasetId: parseInt(datasetId)
        }
    })

    return response
}