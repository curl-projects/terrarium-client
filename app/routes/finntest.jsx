import Header  from "~/components/Header/Header"

export default function FinnTest(){
    return(
        <>
            <Header />
            <div className='kanbanRoadmapWrapper'>
                    <div className='kanbanRoadmapTitle'>
                        <h1 className='kanbanRoadmapTitleText'>Roadmap</h1>
                    </div>
                    <div className='kanbanRoadmapDescription'>
                        <p className='kanbanRoadmapDescriptionText'>Use this space to create and organise features.</p>
                    </div>
                    <div className='kanbanRoadmapColumns'>
                        
                    </div>
            </div>
        </>
    )
}