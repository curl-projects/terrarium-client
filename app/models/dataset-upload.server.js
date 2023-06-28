import { db } from "./db.server";
import { Storage } from '@google-cloud/storage';
import stream from "stream";

import { PassThrough } from "stream";
import { writeAsyncIterableToWritable } from "@remix-run/node"; // `writeAsyncIterableToWritable` is a Node-only utility
import { json } from "@remix-run/node"
import { Readable } from "stream"
import { PineconeClient } from "@pinecone-database/pinecone";

export async function createBaseDataset(userId, uniqueFileName, origin){
    const baseDataset = await db.baseDataset.create({
        data: {
            userId: userId,
            uniqueFileName: uniqueFileName,
            origin: origin
        }
    })

    return baseDataset
}

export async function getBaseDatasets(userId){
    const baseDatasets = await db.baseDataset.findMany({
        where: {
            user: {
                id: userId
            }
        },
        include: {
            datasets: true
        }
    })
    return baseDatasets
}

export async function getDatasets(userId){
    const datasets = await db.dataset.findMany({
        where: {
            user: {
                id: userId
            }
        },
        include: {
            datasetMapping: true
        }
    })
    return datasets
}

export async function createDatasetObject(fileName, userId, headerMapping, baseDatasetId){

  const uniqueId = Math.random().toString(36).slice(2, 5);
  const dataset = await db.dataset.create({
    data: {
        uniqueFileName: `${uniqueId}-${fileName}`,
        user: {
            connect: {
                id: userId
            }
        },
        baseDataset: {
            connect: {
                baseDatasetId: parseInt(baseDatasetId)
            }
        },
        datasetMapping: {
            create: {
                text: headerMapping.text,
                author: headerMapping.author,
                createdAt: headerMapping.created_at,
                id: headerMapping.id,
                searchFor: headerMapping.searchFor
    
            }
        },
    },
  })

  return dataset
}

export async function initiateDatasetProcessing(fileName, baseDatasetFileName, datasetId, userId, headerMapping){
    console.log("Initiated Dataset Processing")

    let url = process.env.DATASET_PROCESSING_URL

    let data = {
      'file_name': fileName,
      'base_file_name': baseDatasetFileName,
      'dataset_id': datasetId,
      'user_id': userId,
      header_mapping: headerMapping
    }
    try{
        const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
        })

        console.log("SERVER RES:", res)
    
        return res
    }
    catch(exc){
        console.error("Server Exception:", exc)
        return { status: "404"}
    }
  }

export async function readFile(fileName){
    const bucketName = "terrarium-fr-datasets";

    const cloudStorage = new Storage({
        projectId: process.env.GOOGLE_STORAGE_PROJECT_ID,
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        credentials: {
            client_email: process.env.GOOGLE_STORAGE_EMAIL,
            private_key: process.env.GOOGLE_STORAGE_PRIVATE_KEY
        }
    });

    const contents = await cloudStorage.bucket(bucketName).file(fileName).download()

    return contents

}

const uploadStreamToCloudStorage = async (fileData, fileName) => {
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

    const uniqueId = Math.random().toString(36).slice(2, 9);

    const uniqueFileName = `${uniqueId}-${fileName}`

    const file = cloudStorage.bucket(bucketName).file(uniqueFileName);

    const text = await fileData.text()

    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(text);
    passthroughStream.end();

    async function fileUpload(){
        passthroughStream.pipe(file.createWriteStream()).on('finish', () => {
            console.log("COMPLETED!")
        });
        file.create
    }

    fileUpload().catch(console.log)


    return JSON.stringify({fileName: fileName, uniqueFileName: uniqueFileName, completed: true})
};

export const googleUploadHandler = async (requestData) => {
  const filename = requestData.name
  const file = requestData

  console.log("STREAM:", file)
  console.log("FILENAME:", filename)
//   const stream = Readable.from(data)
  const upload = await uploadStreamToCloudStorage(file, filename);
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

export async function deleteDatasetEmbeddings(datasetId){
    const featureRequests = await db.featureRequest.findMany({
        where: {
            datasetId: parseInt(datasetId)
        }
    })

    const datasetFRs = featureRequests.map(i => i.fr_id)

    let pinecone = new PineconeClient();

    await pinecone.init({
        environment: "us-west1-gcp",
        apiKey: process.env.PINECONE_KEY
    })

    const index = pinecone.Index('terrarium');

    const deletedVectors  = await index.delete1({
        ids: datasetFRs
    })

    return { deletedVectors }
}