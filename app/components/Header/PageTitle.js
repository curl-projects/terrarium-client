export default function PageTitle(props){
    return(
    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        }}>
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