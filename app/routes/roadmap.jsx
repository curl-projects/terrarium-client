import { useEffect } from "react";
import { useLoaderData, useActionData } from "@remix-run/react"

import Header from "~/components/Header/Header";
import Kanban from "~/components/NewKanban/Kanban"

import { authenticator } from "~/models/auth.server.js";

import { getFeatures, createFeature } from "~/models/kanban.server"

import { processCardState } from "~/utils/processCardState"

export async function loader({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })
  const features = await getFeatures(user.id)

  const organisedFeatures = processCardState(features)

  return({ features: organisedFeatures })
}

export async function action({ request }){
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  const formData = await request.formData();
  const columnState = formData.get('columnState')
  const rankState = formData.get('rankState')

  const feature = await createFeature(user.id, columnState, rankState)

  return({ columnState: columnState})
}

export default function Roadmap(){
  const loaderData = useLoaderData();
  const actionData = useActionData();

  useEffect(()=>{
    console.log("LOADER DATA:", loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
  }, [actionData])

  return(
    <>
      <Header />
      <div className="kanbanWrapper">
        <Kanban features={loaderData.features}/>
      </div>
    </>
  )
}
