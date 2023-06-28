import { authenticator } from "~/models/auth.server.js";
import { getAuthorizedUsers, createAuthorizedUser } from "~/models/user.server";

import { useEffect, useState } from 'react';
import Header from "~/components/Header/Header";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { FiUserPlus } from "react-icons/fi";
import { Form, useLoaderData } from "@remix-run/react"

import AuthorizedUserRow from "~/components/Integrations/AuthorizedUserRow"

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

    const [authUserPlatform, setAuthUserPlatform] = useState("")
    const [authUserCommunity, setAuthUserCommunity] = useState("")
    const [authUser, setAuthUser] = useState("")

    useEffect(()=>{
        console.log("LOADER DATA", loaderData)
    }, [loaderData])

    return(
        <div className='pageWrapper'>
            <Header />
            <div className='integrationsFlexWrapper'>
                <Form className='integrationsAuthUserWrapper' method='post'>
                    <input type='hidden' name='userId' value={loaderData.user.id}/>
                    <input type='hidden' name='platform' value={authUserPlatform}/>
                    <input type='hidden' name='community' value={authUserCommunity}/>
                    <input type='hidden' name='username' value={authUser}/>
                    <FiUserPlus style={{fontSize: "30px", color: "#4b5563"}}/>
                    <p className='authUploadText'>Authorize User</p>
                    <div className='authUserRow'>
                        <div className="authUserLabel">
                            <p className='fileOptionLabelText'>Platform</p>
                        </div>
                        <div className='authUserInputWrapper'>
                            <Select
                                value={authUserPlatform}
                                className='fileOptionInputSelect'
                                onChange={(e) => setAuthUserPlatform(e.target.value)}
                                style={{width: "100%"}}
                            >
                                <MenuItem className='fileSelectMenuItem' value='discord'>Discord</MenuItem>
                                <MenuItem className='fileSelectMenuItem' value='slack' disabled>Slack (Coming Soon)</MenuItem>
                                <MenuItem className='fileSelectMenuItem' value='telegram' disabled>Telegram (Coming Soon)</MenuItem>
                            </Select>
                        </div>
                    </div>
                    {/* {authUserPlatform === 'discord' && */}
                    {true &&
                        <div className='authUserRow'>
                            <div className="authUserLabel">
                                <p className='fileOptionLabelText'>Guild</p>
                            </div>
                            <div className='authUserInputWrapper'>
                                <TextField
                                    className='authUserTextField'
                                    onChange={(e) => setAuthUserCommunity(e.target.value)}
                                    style={{width: "100%", height: "100%"}}
                                />
                            </div>
                        </div>
                    }
                    {/* {authUserCommunity && */}
                    {true &&
                    <div className='authUserRow'>
                        <div className="authUserLabel">
                            <p className='fileOptionLabelText'>Username</p>
                        </div>
                        <div className='authUserInputWrapper'>
                            <TextField
                                className='authUserTextField'
                                onChange={(e) => setAuthUser(e.target.value)}
                                style={{width: "100%", height: "100%"}}
                            />
                        </div>
                    </div>
                    }
                    {true &&
                        <>
                        <div style={{height: "20px"}}/>
                        <div className='fileSubmitWrapper'>
                            <button className='fileSubmit' type='submit'>Upload</button>
                        </div>
                        </>
                    }
                </Form>
                <div className='authorizedUsersWrapper'>
                    <p className='datasetsLabelText'>Authorized Users</p>
                    {loaderData.authUsers?.map((user, idx) =>
                        <AuthorizedUserRow 
                            key={idx}
                            user={user}
                        /> 
                    )}
                </div>
            </div>
        </div>
    )
}