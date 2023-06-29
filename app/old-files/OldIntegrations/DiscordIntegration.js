import { useState, useEffect } from "react";
import { useFetcher } from "@remix-run/react";

import discordIcon from "../../../public/assets/discord-icon.png"

export default function DiscordIntegration(props){

  useEffect(()=>{
    console.log("USER ID", props.databaseUser.discordBotAuth, props.userId)
  }, [props])

  const fetcher = useFetcher();

  function handleDiscordClick(){
    fetcher.submit({ userId: props.databaseUser.id}, { method: "post", action: "/utils/discord-bot-update"})
    window.open("https://discord.com/api/oauth2/authorize?client_id=1038871570808053840&permissions=8&scope=bot", "_blank")
  }

  return(
    <div className='integrationBox'>
      <div className='integrationBoxWrapper'>
        <div className='connectWrapper'>
          <div>
            <img className='integrationIcon' src={discordIcon}></img>
          </div>
          <div style={{flex: 1}}/>
          <div className='buttonRowWrapper'>
            {props.databaseUser.discordBotAuth &&
            <button className='connectButton' onClick={handleDiscordClick}>
              <p style={{fontSize: "18px"}}>Update</p>
            </button>
            }
            <button className={props.databaseUser.discordBotAuth ? 'connectedButton' : 'connectButton'} onClick={!props.databaseUser.discordBotAuth ? handleDiscordClick : ()=>{}}>
              {props.databaseUser.discordBotAuth
                ? <p style={{fontSize: "18px", color: 'rgb(94, 160, 85)'}}>Connected</p>
                : <p style={{fontSize: "18px"}}>Connect</p>}
            </button>
          </div>
        </div>
        <div className='serviceNameWrapper'>
          <p style={{fontSize: "24px"}}>Discord</p>
        </div>
        <div style={{flex: 1}}>
          <p>Invite our Discord bot to your guild! (It doesn't bite, we promise)</p>
        </div>
      </div>
    </div>
  )
}
