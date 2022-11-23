import { redis } from "~/models/redis.server";

export async function createTextBox(featureId){
  let initialData = '{"blocks":[{"key":"9lhsg","text":"Hello world!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}'
  const created = await redis.set(featureId, initialData)
}

export async function findTextBox(featureId){
  const textBox = await redis.get(featureId)

  return textBox
}

export async function updateTextBox(featureId, serializedContent){
  const update = await redis.set(featureId, serializedContent)
}

export async function deleteTextBox(featureId){
  const deleted = await redis.delete(featureId)
}
