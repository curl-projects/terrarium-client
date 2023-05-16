import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { getPinnedFeatureRequests } from "~/models/kanban.server";
import { authenticator } from "~/models/auth.server.js";

export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const pinnedFeatureRequests = await getPinnedFeatureRequests(user.id)

    return pinnedFeatureRequests
}

export default function Pinned(){
    const loaderData = useLoaderData()

    useEffect(()=>{
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])

    return(
        <div>
            <h1>Hello!</h1>
        </div>
    )
}