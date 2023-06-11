import LinearProgress from '@mui/material/LinearProgress';

export default function MessageStreamClusters(props){
    return(
        <>
        <div className='messageStreamClustersLoaderWrapper'>
            {props.clustersGenerated === "initiated" && 
                <LinearProgress 
                    variant="indeterminate"
                    style={{
                        width: "95%",
                        height: "2px",
                        backgroundColor: 'rgba(119, 153, 141, 0.3)'
                    }}/>
            }
        </div>
        </>
    )
}