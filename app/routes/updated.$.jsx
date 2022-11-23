// REACT-REMIX IMPORTS
import { useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";

// MODULE IMPORTS
import { authenticator } from "~/models/auth.server.js";
import { readFeature } from "~/models/kanban.server"

// PACKAGE IMPORTS
import cn from 'classnames'

// COMPONENTS
import FeatureHeader from "~/components/Feature/FeatureHeader"
import RichTextEditor from "~/components/TextEditor/RichTextEditor.tsx"


export async function loader({ request, params}){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const featureId = params["*"]
  const feature = await readFeature(featureId)

  if(feature.isSearched){
    console.log("Is searched!")
  }

  return { feature: feature }
}


export default function FeatureNotepad(){
  const loaderData = useLoaderData();

  return(
    <>
      <FeatureHeader />
        <div className="relative md:p-24 lg:px-32 lg:py-22 xl:px-56 xl:py-24 2xl:px-96 2xl:py-32 h-screen w-screen"
          style={{margin: "60px"}}>
          <div className="h-full w-full bg-gray-100 border flex">
            <div
              className={cn(
                "bg-white bg-clip-border grow flex flex-col relative transition-all duration-500 ease-in-out")}
            >
            <ClientOnly>
              {() => <RichTextEditor featureId={loaderData.feature.id} />}
            </ClientOnly>
            </div>

            <div className='bg-gray-100 overflow-y overflow-x-hidden xl:w-2/5 md:w-3/5 sm:w-3/5'>
            </div>
          </div>
        </div>
    </>
  )
}
