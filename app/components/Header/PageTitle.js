export default function PageTitle(props){
    return(
    <div className='pageTitleOuterWrapper' style={{paddingLeft: props.padding ? "5%" : "0%", paddingRight: props.padding ? "5%" : "0%"}}>
        <div className='pageTitle'>
            <h1 className='pageTitleText'>{props.title}</h1>
            <div className='pageTitleDivider'/>
        </div>
        <div className='pageTitleDescription'>
            <p className='pageTitleDescriptionText'>{props.description}</p>
        </div>
    </div>
    )
}