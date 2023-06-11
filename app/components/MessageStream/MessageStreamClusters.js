import LinearProgress from '@mui/material/LinearProgress';

export default function MessageStreamClusters(){
    return(
        <>
        <div className='messageStreamClustersLoaderWrapper'>
            <LinearProgress 
                variant="indeterminate"
                style={{
                    width: "95%",
                    height: "2px",
                    backgroundColor: 'rgba(119, 153, 141, 0.3)'
                }}/>
        </div>
        </>
    )
}