import { addFilter, deleteFilter } from "~/models/kanban.server"

export async function action({ request }){

    const formData = await request.formData()
    const requestType = formData.get('requestType')

    if(requestType === 'create'){
        const featureId = formData.get("featureId")
        const type = formData.get('type')

        if(type === 'date'){
            const dateVariant = formData.get('dateVariant')
            const date = formData.get('date')
            const filter = await addFilter(featureId, type, {dateVariant: dateVariant, date: date})

            return { filter }
        }
        else if(type === 'author'){
            const author = formData.get('author')
            const filter = await addFilter(featureId, type, {author: author})

            return { filter }
        }
        else{
            console.error("Filter Creation Error")
            return "Error"
        }
    }
    else if(requestType === 'delete'){
        const filterId = formData.get("filterId")
        const filter = await deleteFilter(filterId)

        return filter
    }
    else{
        console.error("Unexpected Action Behaviour")
        return null
    }

}