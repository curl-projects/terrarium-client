export default function LandingPageRoadmapTitle(props){

    return(
    <div className='pageTitleOuterWrapper' 
        style={{
            flex: props.leftSide ? "1.2" : "unset"
        }}>
        <div className='pageTitle' style={{textAlign: "center", display: 'flex', flexDirection: "column", alignItems: "center"}}>
            <h1 className='landingPageTitleText'>
                ...and analyse relevant data to identify trends and patterns.
            </h1>
            <div className='pageTitleDivider' style={{marginBottom: "60px", width: "80%", marginTop: "10px"}}/>
        </div>
    </div>
    )
}