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
    const datasets = await db.datasetUserMapping.findMany({
        where: {
            user: {
                id: userId
            },
        },
        include: {
            dataset: {
                include: {
                    baseDataset: true,
                    datasetMapping: true
                }
            }
        }
    })
    return datasets
}

export async function getExampleDatasets(userId){
    const exampleDatasets = await db.exampleDataset.findMany({
        where: {
            userId: userId
        },
        include: {
            dataset: true
        }
    })
    return exampleDatasets
}

export async function connectExampleDataset(userId, datasetId){
    try {
        const exampleDataset = await db.exampleDataset.update({
            where: {
                userId_datasetId: {
                    userId: userId,
                    datasetId: parseInt(datasetId)
                }
            },
            data: {
                active: true
            }})
        
        const userDatasetMapping = await db.datasetUserMapping.upsert({
            where: {
                userId_datasetId: {
                    userId: userId,
                    datasetId: parseInt(datasetId)
                }
            },
            create: {
                userId: userId,
                datasetId: parseInt(datasetId)
            },
            update: {
                userId: userId,
                datasetId: parseInt(datasetId)
            }
        })
    
        return userDatasetMapping    
    } catch (error) {
        console.log('CONNECT DATASET ERROR', error)
    }
    
}

export async function disconnectExampleDataset(userId, datasetId){
    try {
        const exampleDataset = await db.exampleDataset.update({
            where: {
                userId_datasetId: {
                    userId: userId,
                    datasetId: parseInt(datasetId)
                }
            },
            data: {
                active: false
            }})
        
        const userDatasetMapping = await db.datasetUserMapping.delete({
            where: {
                userId_datasetId: {
                    userId: userId,
                    datasetId: parseInt(datasetId)
                }
            }
        })
    
        return userDatasetMapping   
    } catch (error) {
        console.log("DISCONNECT DATASET ERROR:", error)
    } 
}

export async function createDatasetObject(fileName, userId, headerMapping, baseDatasetId){

  const uniqueId = Math.random().toString(36).slice(2, 10);
  const dataset = await db.dataset.create({
    data: {
        uniqueFileName: `${uniqueId}-${fileName}`,
        readableName: fileName.split('-').slice(1).join("-"),
        users: {
            create: [
                {
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            ]
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

export async function initiateDatasetProcessing(fileName, baseDatasetFileName, datasetId, userId, headerMapping, updateExistingDataset){
    console.log("Initiated Dataset Processing", updateExistingDataset)

    let url = process.env.DATASET_PROCESSING_URL

    let data = {
      'file_name': fileName,
      'base_file_name': baseDatasetFileName,
      'dataset_id': datasetId,
      'user_id': userId,
      "header_mapping": headerMapping,
      "update_existing_dataset": updateExistingDataset ? "True" : "False"
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

export async function deleteBaseDataset(baseDatasetId){
    const response = await db.baseDataset.delete({
        where: {
            baseDatasetId: parseInt(baseDatasetId)
        }
    })

    return response
}

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

export async function deleteDatasetEmbeddings(uniqueFileName){
    let pinecone = new PineconeClient();

    await pinecone.init({
        environment: "us-west1-gcp",
        apiKey: process.env.PINECONE_KEY
    })

    const index = pinecone.Index('terrarium');

    const deletedVectors  = await index._delete({
        deleteRequest: {
            filter: {
                dataset: {
                    "$eq": uniqueFileName
                }
            }
        }
    })

    return { deletedVectors }
}