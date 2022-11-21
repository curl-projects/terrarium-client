import { updateAllFeaturePositions } from "~/models/kanban.server"

export async function loader({ request }){
  const url = new URL(request.url)
  const columns = url.searchParams.get('columns')
  console.log("FORM DATA:", columns)
  // const columns = formData.get('columns')
  const updatedFeatures = await updateAllFeaturePositions(Object.values(JSON.parse(columns)))
  // console.log("HELLO RESOURCE ROUTE!", columns)
  return({ columns: 'hi'})

}
