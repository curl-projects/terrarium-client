import { useState } from "react";
import { Form, useTransition } from "@remix-run/react"

import { BsFillArrowRightCircleFill } from "react-icons/bs"

import userIcon from "../../../public/assets/user-icon.png";

export default function UserAuthIntegration(props){
  const [usersUpdate, setUsersUpdate] = useState(false)
  const transition = useTransition()

  return(
    <div className='integrationBox'>
      <div className='integrationBoxWrapper'>
        <div className='connectWrapper'>
          <div>
            <img className='integrationIcon' src={userIcon}></img>
          </div>
          <div style={{flex: 1}}/>
          <div className='buttonRowWrapper'>
            <button className='connectButton' onClick={()=>setUsersUpdate(prevState => !prevState)}>
                <p style={{fontSize: "18px"}}>{usersUpdate ? "Cancel" : "Update"}</p>
            </button>
            <button className={props.usersAreAuthenticated ? 'connectedButton' : 'connectButton'}>
              {props.usersAreAuthenticated
                ? <p style={{fontSize: "18px", color: 'rgb(94, 160, 85)'}}>Connected</p>
                : <p style={{fontSize: "18px"}}>Connect</p>}
            </button>
          </div>
        </div>
        <div className='serviceNameWrapper'>
          <p style={{fontSize: "24px"}}>User Authorization</p>
        </div>
        <div style={{flex: 1}}>
          <p>Set the guild and usernames that have access to your Notion workspace</p>
        </div>
        {usersUpdate &&
          <div className='discordInputWrapper'>
            <Form method="post" action='/dashboard'>
              <input type="hidden" name="botId" value={props.loaderData.notionAuth[0] && props.loaderData.notionAuth[0].botId}></input>
                <input type='text'
                       name='guildName'
                       placeholder="Guild Name"
                       className='discordInputButton'
                       defaultValue={props.loaderData.notionAuth[0]?.guildName}>
                </input>
              <input type='text'
                     name='discordUsers'
                     placeholder="Authorized Users"
                     className='discordInputButton'
                     defaultValue={props.loaderData.discordUsers?.map(element=>element.username).reverse().join(",")}></input>
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
  )
}
