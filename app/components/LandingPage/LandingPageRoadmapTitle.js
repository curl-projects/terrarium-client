export default function LandingPageRoadmapTitle(props){

    return(
    <div className='pageTitleOuterWrapper' 
        style={{
            flex: props.leftSide ? "1.2" : "unset"
        }}>
        <div className='pageTitle' style={{textAlign: "center", display: 'flex', flexDirection: "column", alignItems: "center"}}>
            <h1 className='landingPageTitleText'>
                Create a roadmap from a set of organised topics...
            </h1>
            <div className='pageTitleDivider' style={{width: "80%", marginTop: "10px"}}/>
        </div>
        <div className='pageTitleDescription' style={{justifyContent: 'center'}}>
            <p className='pageTitleDescriptionText'>{props.description || "No description"}</p>
        </div>
    </div>
    )
}