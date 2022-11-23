import {db} from "~/models/db.server"
import { TextBox } from "@prisma/client"
import { apiResponse, ApiHandler } from "~/components/TextEditor/apiResponse"
import { findTextBox } from "~/models/text-box.server";

export const loader: ApiHandler<{textBox: TextBox}> = async ({params}) => {
    if (!params.id) {
        return apiResponse(400, "did not receive argument for feature id")
    }

    const featureId = parseInt(params.id)
    if (isNaN(featureId) || (featureId !== parseFloat(params.id))) {
        return apiResponse(400, "id must be parsable as int")
    }

    const textBox = await findTextBox(featureId)
    if (textBox === null) {
        return apiResponse(404, "not found in database")
    }

    return apiResponse(200, "success", {textBox})
}
