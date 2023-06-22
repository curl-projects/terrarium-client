export default function OutletPlaceholder(props){
    return(
        <div className='searchOutletWrapper'>
            <h1 className='searchOutletText'>
                {props.isSearched 
                    ? "I couldn't find any feature requests associated with that feature description. Try again with another variant."
                    : "Enter a feature description above to get started"
                }
            </h1>
        </div>
    )
}