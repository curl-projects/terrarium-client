import { useEffect } from "react";
import { BsFileArrowUp, BsX} from "react-icons/bs";
import { useFetcher } from "@remix-run/react"
import { FiUser } from "react-icons/fi"

export default function AuthorizedUserRow(props){
    const deleteFetcher = useFetcher();

    console.log("PROPS> USER:", props.user)
    
    function handleDelete(){
        deleteFetcher.submit({authUserId: props.user.authUserId}, {method: "post", action: "utils/delete-auth-user"})
    }

    return(
        <div className='authUserOuterWrapper' >
                    <div className='fileIconWrapper'>
                        <FiUser style={{fontSize: "26px", color: "rgba(75, 85, 99, 0.85)"}}/>
                    </div>
                    <div className='fileInnerWrapper'>
                        <div className='fileTitleRow'>
                            <div className='fileTitleWrapper'>
                                <p className='fileTitle'>@{props.user.username || `Untitled (${props.idx})`}</p>
                            </div>
                            <div style={{flex: 1}}/>
                            <div className='fileRemoveWrapper'>
                                <BsX 
                                    onClick={handleDelete}
                                    style={{fontSize: "28px", color: "rgba(75, 85, 99, 0.95)", cursor: "pointer"}}/>
                            </div>
                        </div>
                        <div className='fileMetadataRow'>
                            <div className='fileMetadataWrapper'>
                                <p className='fileMetadata'>{props.user?.community ? props.user.community : "Unknown Community"}</p>
                                <div className='fileMetadataDivider' />
                                <p className='fileMetadata'>{props.user?.platform ? props.user.platform : "Unknown Platform"}</p>
                            </div>
                        </div>
                    </div>
            </div>
    )
}