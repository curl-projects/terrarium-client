import { json } from "@remix-run/node"

export const apiResponse = (responseCode, message, payload)=> {
    const resp = {ok: responseCode === 200}
    if (message) {
        resp["message"] = message
    }

    if (payload) {
        resp["payload"] = payload
    }

    return json(resp, responseCode)
}
