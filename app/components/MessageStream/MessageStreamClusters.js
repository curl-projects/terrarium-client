import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import ClusterCard from "~/components/MessageStream/ClusterCard"

export default function MessageStreamClusters(props){

    const [allCardsStatus, setAllCardsStatus] = useState([])

    useEffect(()=>{
        let tempObject = {}
        props.clusterData && props.clusterData.map((clusterData, idx) => (
            tempObject[idx] = {expanded: false}
        ))

        setAllCardsStatus(tempObject)
    }, [props.clusterData])

    
    return(
        <>
        {/* {props.clustersGenerated === "initiated" && 
            <LinearProgress 
                variant="indeterminate"
                style={{
                    width: "95%",
                    height: "2px",
                    backgroundColor: 'rgba(119, 153, 141, 0.3)'
                }}/>
        } */}
        <div className="pl-10 pr-8 flex flex-col gap-2" style={{backgroundColor: "rgb(243, 244, 246)"}}>
            {props.clusterData && props.clusterData.map((clusterData, idx) => (
                <ClusterCard 
                    key={clusterData[0].featureRequest.cluster.internalClusterId}
                    clusterIndex={idx}
                    isExpanded={props.isExpanded}
                    clusterData={clusterData}
                    pinCard={props.pinCard}
                    setZoomObject={props.setZoomObject}
                    expandSpecificCard={props.expandSpecificCard}
                    setAllCardsStatus={setAllCardsStatus}
                    allCardsStatus={allCardsStatus}
                    pinnedCards={props.pinnedCards}
                    placeholder={props.placeholder}
                />
            ))
            }
        </div>
        </>
    )
}