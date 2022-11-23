import React from "react"
import {AiOutlineCloudUpload} from "react-icons/ai"
import {FcCheckmark} from "react-icons/fc"
import {RiSignalWifiErrorLine} from "react-icons/ri"
import { CgSpinner } from "react-icons/cg"

const SyncIndicator = (props: {syncState: "idle" | "syncing" | "error"}) => {
    return (
        <div>
            {props.syncState === "idle" &&
                <FcCheckmark/>}
            {props.syncState === "error" &&
                <RiSignalWifiErrorLine />}
            {props.syncState === "syncing" &&
                <CgSpinner className="animate-spin"/>}
        </div>
    )
}

export default SyncIndicator