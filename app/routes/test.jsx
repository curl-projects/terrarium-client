export default function TestEnv(){
    return(
        <div style={{display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw"}}>
            <div className="kanbanCardWrapper">
                <div className='kanbanCardBookmark'></div>
                <div className='kanbanCardContent'>
                    <div className='kanbanCardTitle'>
                        <h1 className='kanbanCardTitleText'>Title</h1>
                    </div>
                    <div className='kanbanCardPinned'>
                        <p className='kanbanCardPinnedText'><em>5 pinned messages</em></p>
                    </div>
                    <div className='kanbanCardDescription'>
                        <p className='kanbanCardDescriptionText'>No description</p>
                    </div>
                </div>
            </div>
        </div>
    )
}