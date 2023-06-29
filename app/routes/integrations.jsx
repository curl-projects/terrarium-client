import { authenticator } from "~/models/auth.server.js";
import { getAuthorizedUsers, createAuthorizedUser } from "~/models/user.server";

import { useEffect, useState } from 'react';
import Header from "~/components/Header/Header";
import { useLoaderData, useActionData } from "@remix-run/react"

import IntegrationsUserForm from "~/components/Integrations/IntegrationsUserForm";
import AuthorizedUserRow from "~/components/Integrations/AuthorizedUserRow"

import PageTitle from "~/components/Header/PageTitle.js"

import { FaDiscord } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa"
import { BsSlack } from "react-icons/bs"

import Snackbar from '@mui/material/Snackbar';

import TextField from '@mui/material/TextField';
import { RiFileCopyLine } from 'react-icons/ri'
import { MdOpenInNew } from "react-icons/md"
import { MdDoneAll } from "react-icons/md"
import Tooltip from '@mui/material/Tooltip';



function titleize(str) {
    let upper = true
    let newStr = ""
    for (let i = 0, l = str.length; i < l; i++) {
        // Note that you can also check for all kinds of spaces  with
        // str[i].match(/\s/)
        if (str[i] == " ") {
            upper = true
            newStr += str[i]
            continue
        }
        newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase()
        upper = false
    }
    return newStr
}



export async function loader({ request }){
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/",
      })

    const authUsers = await getAuthorizedUsers(user.id)

    return { user: user, authUsers: authUsers }
}
export async function action({ request }){
    const formData = await request.formData()
    const userId = formData.get('userId')
    const platform = formData.get('platform')
    const community = formData.get('community')
    const username = formData.get('username')

    const authUser = await createAuthorizedUser(platform, community, username, userId)

    return { authUser: authUser }
}

export default function Integrations(){
    const loaderData = useLoaderData();
    const actionData = useActionData();

    const [clickedIntegration, setClickedIntegration] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [copied, setCopied] = useState(false)

    function handleInteractionClick(element){
        console.log("ELEMENT:", element)
        if(element.platform === 'discord'){
            if(clickedIntegration){
                if(clickedIntegration.platform === element.platform){
                    setClickedIntegration("")
                }
                else{
                    setClickedIntegration(element)
                }
            }
            else{
                setClickedIntegration(element)
            }
        } else{
            setSnackbarOpen(true)
        }
    }

    return(
        <>
        <div className='integrationsPageWrapper'>
            <Header />
            <PageTitle title="Integrations" padding={false} description="Connect to Discord, Slack and Telegram."/>
            
            <div className='integrationsFlexWrapper'>
                <div 
                className='integrationContainersRow'>
                {[{platform: 'discord', icon: <FaDiscord />}, {platform: 'telegram', icon: <FaTelegramPlane />}, {platform: 'slack', icon: <BsSlack />}].map((element, idx) => 
                    <div 
                        className='integrationMainContainer'
                        key={idx}
                        style={{
                            opacity: element.platform !== 'discord' ? 0.6 : 1,
                        }}
                        
                        onClick={()=>handleInteractionClick(element)}
                    >
                         <p className='integrationContainerTitle' style={{paddingLeft: "20px", paddingRight: "20px"}}><span className="integrationContainerTitleIcon">{element.icon}</span>{titleize(element.platform || "")}</p>   
                         {/* <p className='integrationsMainContainerIcon'>{element?.icon}</p> */}
                    </div>
                )}
                </div>
                <div className='expandedIntegrationMainContainer' style={{
                    height: !clickedIntegration && "0px",
                    borderWidth: !clickedIntegration && "0px"
                }}>
                    <div className='integrationContainerCreateWrapper'>
                        <div className='integrationContainerTitleRow'>
                            <p className='integrationContainerTitle'><span className="integrationContainerTitleIcon">{clickedIntegration?.icon}</span>{titleize(clickedIntegration?.platform || "")}</p>
                        </div>
                        <p className='authUserTitleText'>Connect to Discord</p>
                        <div className='authUserRowWrapper' style={{marginBottom: "10px"}}>
                            <div className='authUserRow' style={{height: "unset"}}>
                                <div className='integrationsTextFieldInputWrapper'>
                                    <TextField
                                        multiline={true}
                                        disabled
                                        className='integrationsTextField'
                                        sx={{color: "green"}}
                                        style={{width: "100%", height: "100%"}}
                                        value={"https://discord.com/api/oauth2/authorize?client_id=1038871570808053840&permissions=8&scope=bot"}
                                        spellCheck="false"
                                    />
                                </div>
                            </div>
                            <div style={{height: "20px"}}/>
                            <div className='integrationsUrlCopyButtonsWrapper'>
                                <div className='fileSubmitWrapper'>
                                    <button 
                                        className='fileSubmit' 
                                        style={{fontSize: '20px'}}
                                        onClick={() => {setCopied(true); navigator?.clipboard?.writeText("https://discord.com/api/oauth2/authorize?client_id=1038871570808053840&permissions=8&scope=bot")}}
                                        >
                                        {copied 
                                            ? <Tooltip title="Copy Invite Url" placement='top' arrow><span><MdDoneAll /></span></Tooltip>
                                            : <Tooltip title="Copy Invite Url" placement='top' arrow><span><RiFileCopyLine /></span></Tooltip>
                                        }
                                    </button>
                                </div>
                                <div className='fileSubmitWrapper'>
                                    <Tooltip title="Open in New Tab" placement='top' arrow>
                                    <a 
                                        className='fileSubmit' 
                                        href="https://discord.com/api/oauth2/authorize?client_id=1038871570808053840&permissions=8&scope=bot" 
                                        target="_blank" 
                                        tyle={{fontSize: '20px', display: "button"}}><MdOpenInNew /></a>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        <IntegrationsUserForm 
                            platform="discord"
                            user={loaderData.user}
                            actionData={actionData}
                        />
                    </div>
                    <div className='integrationContainerViewWrapper'>
                        <div className='integrationMetadataRow'>
                            <div className='integrationMetadataSection'>
                                <p className='integrationMetadataText'>
                                    <span className='integrationMetadataIcon'>{loaderData.authUsers.length}</span>
                                    {loaderData.authUsers.length === 1 ? "Authorized User" : "Authorized Users"}
                                </p>
                            </div>

                        </div>
                        <div className='integrationContainerViewPanel'>
                            {loaderData.authUsers?.map((user, idx) =>
                                <AuthorizedUserRow 
                                    key={idx}
                                    user={user}
                                /> 
                              )}
                        </div>
                    </div>
                </div>

            </div>            
        </div>
        <Snackbar
        sx={{
            backgroundColor: "white"
        }}
         autoHideDuration={6000}
         open={snackbarOpen}
         onClose={()=>setSnackbarOpen(false)}
         message="Coming Soon"
    />
        </>
    )
}