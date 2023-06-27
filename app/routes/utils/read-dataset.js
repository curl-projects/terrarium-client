import { readFile } from "~/models/dataset-upload.server"

export async function loader({ request }){
    const url = new URL(request.url)
    const fileName = url.searchParams.get('fileName')

    const fileContents = await readFile(fileName);

    
    return { fileContents: fileContents.toString() }

}