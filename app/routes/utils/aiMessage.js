import { respondToMessage } from "~/models/ai-logic.server"

export async function action({ request }){
    console.log("HI!")
    const output = await respondToMessage('Hi!')
    console.log("OUTPUT:", output)
    return { output }
}