import { useState } from "react";

import notionIcon from "../../../public/assets/notion-icon.png"

export default function NotionIntegration(props){
  return(
    <div className='integrationBox'>
      <div className='integrationBoxWrapper'>
        <div className='connectWrapper'>
          <div>
            <img className='integrationIcon' src={notionIcon}></img>
          </div>
          <div style={{flex: 1}}/>
          <div className='buttonRowWrapper'>
            {props.notionIsAuthenticated &&
            <button className='connectButton' onClick={()=> window.open('https://api.notion.com/v1/oauth/authorize?client_id=d2e58919-d704-42a9-8638-c8c92806d68c&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion', "_self")}>
              <p style={{fontSize: "18px"}}>Update</p>
            </button>
            }
            <button className={props.notionIsAuthenticated ? 'connectedButton' : 'connectButton'} onClick={function(){if(!props.notionIsAuthenticated){window.open('https://api.notion.com/v1/oauth/authorize?client_id=d2e58919-d704-42a9-8638-c8c92806d68c&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fnotion', "_self")}}}>
              {props.notionIsAuthenticated
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
  )
}
