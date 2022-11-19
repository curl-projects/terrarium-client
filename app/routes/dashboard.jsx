import { useEffect, useState } from "react";
import { useLoaderData, useActionData, Form, useTransition } from "@remix-run/react";
import { authenticator } from "~/models/auth.server.js";
import { authenticateNotionCode, createNotionAuth,
         readNotionAuth, addGuildAndUsers, readDiscordUsers } from "~/models/notion.server"
import cn from 'classnames'
import { BsFillArrowRightCircleFill } from "react-icons/bs"

import Header from "~/components/Header/Header";

import notionIcon from "../../public/assets/notion-logo.png"
import discordIcon from "../../public/assets/discord.png";


const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};


export const loader = async ({ request }) => {
  // authenticator.isAuthenticated function returns the user object if found
  // if user is not authenticated then user would be redirected back to homepage ("/" route)
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })

  // console.log("USER", user)

  const url = new URL(request.url)
  const code = url.searchParams.get("code")===null ? 'null' : url.searchParams.get("code")

  // console.log("CODE!", code, code==="null")

  if(code !== "null"){
    const notionResponse = await authenticateNotionCode(code)
    console.log("NOTION RESPONSE:", notionResponse)
    if(notionResponse.error){
      console.log("NOTION ERROR!")
    }
    else{
      const notionAuth = await createNotionAuth(notionResponse, user.id)
      console.log("NOTION AUTH:", notionAuth)
    }
  }

  const notionAuth = await readNotionAuth(user.id)

  console.log("NOTION AUTH", notionAuth)
  const discordUsers = notionAuth[0]?.botId ? await readDiscordUsers(notionAuth[0].botId) : []
  console.log('DISCORD USERS:', discordUsers)
  return({user: user, notionAuth: notionAuth, discordUsers: discordUsers});
};


export const action = async ({ request }) => {
  const formData = await request.formData();
  const botId = formData.get('botId')
  const guildName = formData.get('guildName');
  const discordUsers = formData.get('discordUsers');
  const transaction = await addGuildAndUsers(botId, guildName, discordUsers)
  console.log('FORM DATA:', guildName, discordUsers)
  return { transaction }
}


export default function Dashboard(){
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const transition = useTransition();
  const [notionIsAuthenticated, setNotionIsAuthenticated] = useState(false)
  const [discordIsAuthenticated, setDiscordIsAuthenticated] = useState(false)
  const [discordUpdate, setDiscordUpdate] = useState(false)
  const [discordIsUpdated, setDiscordIsUpdated] = useState(false)


  useEffect(()=>{
    if(loaderData.notionAuth.length === 0){
      setNotionIsAuthenticated(false)
    }
    else{
      setNotionIsAuthenticated(true)
    }

    if(loaderData.discordUsers.length === 0){
      setDiscordIsAuthenticated(false)
    }
    else{
      setDiscordIsAuthenticated(true)
    }
  }, [loaderData])

  useEffect(()=>{
    console.log("LOADER DATA", loaderData)
  }, [loaderData])

  useEffect(()=>{
    console.log("ACTION DATA", actionData)
    if(actionData && actionData["transaction"]){
      setDiscordUpdate(false)
      setDiscordIsUpdated(true)
    }
  }, [actionData])

  return(
    <div style={CONTAINER_STYLES}>
      <Header />
      <div className='integrations'>
        <div className='integrationBox'>
          <div className='integrationBoxWrapper'>
            <div className='connectWrapper'>
              <div>
                <img className='integrationIcon' src={notionIcon}></img>
              </div>
              <div style={{flex: 1}}/>
              <div className='buttonRowWrapper'>
                {notionIsAuthenticated &&
                <button className='connectButton' onClick={()=> window.open('https://api.notion.com/v1/oauth/authorize?client_id=d2e58919-d704-42a9-8638-c8c92806d68c&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion', "_self")}>
                  <p style={{fontSize: "18px"}}>Update</p>
                </button>
                }
                <button className={notionIsAuthenticated ? 'connectedButton' : 'connectButton'} onClick={function(){if(!notionIsAuthenticated){window.open('https://api.notion.com/v1/oauth/authorize?client_id=d2e58919-d704-42a9-8638-c8c92806d68c&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion', "_self")}}}>
                  {notionIsAuthenticated
                    ? <p style={{fontSize: "18px", color: 'rgb(94, 160, 85)'}}>Connected</p>
                    : <p style={{fontSize: "18px"}}>Connect</p>}
                </button>
              </div>
            </div>
            <div className='serviceNameWrapper'>
              <p style={{fontSize: "24px"}}>Notion</p>
            </div>
            <div style={{flex: 1}}>
              <p>Connect your Notion workspace to sync your Discord bug reports. The integration looks for an anchor page called Terrarium, so make sure you've created it and we have access to it!</p>
            </div>
          </div>
        </div>

        <div className='integrationBox'>
          <div className='integrationBoxWrapper'>
            <div className='connectWrapper'>
              <div>
                <img className='integrationIcon' src={discordIcon}></img>
              </div>
              <div style={{flex: 1}}/>
              <div className='buttonRowWrapper'>
                <button className='connectButton' onClick={()=>setDiscordUpdate(prevState => !prevState)}>
                    <p style={{fontSize: "18px"}}>{discordUpdate ? "Cancel" : "Update"}</p>
                </button>
                <button className={discordIsAuthenticated ? 'connectedButton' : 'connectButton'}>
                  {discordIsAuthenticated
                    ? <p style={{fontSize: "18px", color: 'rgb(94, 160, 85)'}}>Connected</p>
                    : <p style={{fontSize: "18px"}}>Connect</p>}
                </button>
              </div>
            </div>
            <div className='serviceNameWrapper'>
              <p style={{fontSize: "24px"}}>Discord</p>
            </div>
            <div style={{flex: 1}}>
              <p>Update the guild and usernames that have access to your Notion workspace</p>
            </div>
            {discordUpdate &&
              <div className='discordInputWrapper'>
                <Form method="post" action='/dashboard'>
                  <input type="hidden" name="botId" value={loaderData.notionAuth[0] && loaderData.notionAuth[0].botId}></input>
                    <input type='text'
                           name='guildName'
                           placeholder="Guild Name"
                           className='discordInputButton'
                           defaultValue={loaderData.notionAuth[0]?.guildName}>
                    </input>
                  <input type='text'
                         name='discordUsers'
                         placeholder="Authorized Users"
                         className='discordInputButton'
                         defaultValue={loaderData.discordUsers?.map(element=>element.username).reverse().join(",")}></input>
                       <div style={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px"}}>
                         <button className="discordUpdateButton" type="submit">
                           {transition.state === 'submitting'
                             ? "..."
                             : <BsFillArrowRightCircleFill style={{height: "20px", width: "20px", color: "rgb(94, 160, 85)"}}/>
                           }
                         </button>
                       </div>

                </Form>

              </div>
            }
          </div>
        </div>
      </div>

    </div>
  );
};
