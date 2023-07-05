export default function PageTitle(props){
    return(
    <div className='pageTitleOuterWrapper' style={{
        gridRow: "2 / 3",
        gridColumn: "2 / 3",
        paddingLeft: props.placeholder & "5%",
        paddingRight: props.placeholder & "5%"
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