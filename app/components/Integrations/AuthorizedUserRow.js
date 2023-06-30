import { useEffect } from "react";
import { BsFileArrowUp, BsX} from "react-icons/bs";
import { useFetcher } from "@remix-run/react"
import { FiUser } from "react-icons/fi"
import Tooltip from '@mui/material/Tooltip';

export default function AuthorizedUserRow(props){
    const deleteFetcher = useFetcher();
    
    function handleDelete(){
        deleteFetcher.submit({authUserId: props.user.authUserId}, {method: "post", action: "utils/delete-auth-user"})
    }

    return(
        <div className='authUserOuterWrapper' >
                    <div className='fileIconWrapper'>
                        <FiUser style={{fontSize: "26px", color: "rgba(75, 85, 99, 0.6)"}}/>
                    </div>
                        <div className='fileTitleRow'>
                            <div className='fileTitleWrapper'>
                                <p className='fileTitle'>@{props.user.username || `Untitled (${props.idx})`} | {props.user?.community ? props.user.community : "Unknown Community"}</p>
                            </div>
                            <div style={{flex: 1}}/>
                            <Tooltip title="Delete Authorized User" placement='top' arrow>
                                <div className='fileRemoveWrapper'>
                                    <BsX 
                                        onClick={handleDelete}
                                        
                                        style={{fontSize: "28px", color: "rgba(75, 85, 99, 0.6)", cursor: "pointer"}}/>
                                </div>
                            </Tooltip>
                        </div>
            </div>
    )
}