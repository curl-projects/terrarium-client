import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { getPinnedFeatureRequests } from "~/models/kanban.server";
import { processPinnedFeatureRequests } from "~/utils/processPinnedFeatureRequests" 
import { authenticator } from "~/models/auth.server.js";
import PinnedFeatureRequest from "~/components/roadmap/PinnedFeatureRequest";

export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const pinnedFeatureRequests = await getPinnedFeatureRequests(user.id)
    console.log("PINNED FEATURE REQUESTS:", pinnedFeatureRequests[0].featureRequests)
    const processedPinnedFeatureRequests = processPinnedFeatureRequests(pinnedFeatureRequests)
    return processedPinnedFeatureRequests
}

export default function Pinned(){
    const loaderData = useLoaderData()

    useEffect(()=>{
        console.log("LOADER DATA:", loaderData)
    }, [loaderData])

    return(
        <div className="pinnedFROuterWrapper">
            {loaderData && loaderData.map((item, index) => (
                <PinnedFeatureRequest item={item} index={index} />
            ))}
        </div>
    )

    // TODO: process loader data in a flat array
}