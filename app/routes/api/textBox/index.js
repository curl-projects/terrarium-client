import {db} from "~/models/db.server";
import invariant from "tiny-invariant";
import { convertFromRaw } from 'draft-js';
import { apiResponse } from "~/components/TextEditor/apiResponse";
import { updateTextBox } from "~/models/text-box.server";

export const loader = () => {
    return apiResponse(400, "must supply id")
}

export const action = async ({request}) => {

    if (request.method !== "POST") {
        return apiResponse(405)
    }
    const payload = await request.formData()

    const parsed_id = payload.get("id")
    if (parsed_id instanceof File) {
        return apiResponse(418, "what are you trying to do here")
    }

    const id = parseInt(parsed_id || "")
    const serializedContent = payload.get("serializedContent")

    // payload validation
    if (isNaN(id) || id !== parseFloat(parsed_id || "")) {
        return apiResponse(400, "must supply a valid argument for id")
    }
    if (typeof serializedContent !== "string") {
        return apiResponse(400, "request must inlcude a content attribute of type string")
    }
    try {
        convertFromRaw(JSON.parse(serializedContent))
    } catch (e) {
        return apiResponse(400, "could not parse serializedContent")
    }

    // TODO: confirm existence of textBox and give better error for this
    // TODO: confirm that the new response is more recent that our last save

    // attempt to update
    try {
        const update = await updateTextBox(id, serializedContent)
        return apiResponse(200)
    } catch (e) {
        return apiResponse(500)
    }
}
