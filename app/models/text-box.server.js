import { db } from "~/models/db.server";

export async function findTextBox(featureId){
  const textBox = await db.textBox.findUnique({
    where: {
      featureId: featureId
    }
  })
  return textBox
}
