import { useState } from "react";
import { Form } from "@remix-run/react"

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { BsPlus } from "react-icons/bs";


export default function IntegrationsUserForm(props){
    const [authUserCommunity, setAuthUserCommunity] = useState("")
    const [authUser, setAuthUser] = useState("")

    return(
    <Form className='integrationsAuthUserWrapper' method='post'>
        <p className='authUserTitleText'>Connect to Discord</p>

        <p className='authUserTitleText'>Add New Authorized User</p>
        <input type='hidden' name='userId' value={props.user.id}/>
        <input type='hidden' name='platform' value={props.platform}/>
        <input type='hidden' name='community' value={authUserCommunity}/>
        <input type='hidden' name='username' value={authUser}/>
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
        {authUserCommunity &&
            <>
            <div className='authUserRowWrapper'>
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
                {authUser &&
                    <>
                    <div style={{height: "20px"}}/>
                    <div className='fileSubmitWrapper'>
                        <button className='fileSubmit' type='submit'><BsPlus /></button>
                    </div>
                    </>
                }
            </div>
            </>
        }
    </Form>
    )
}