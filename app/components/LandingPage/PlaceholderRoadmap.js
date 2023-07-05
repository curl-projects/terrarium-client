import Roadmap from "../Roadmap/Roadmap"
export default function PlaceholderRoadmap(){

    const features = [
        [
            {
                _count: {featureRequests: 3},
                columnState: 1,
                description: "Placeholder Description",
                id: 49,
                isSearched: true,
                rankState: 1,
                title: "Responsive Whiteboards",
                userId: "placeholderid"
            }
        ],
        [

        ],
        [

        ]
    ]

    return(
        <div style={{
            width: "100%",
            height: "100%",
            display: 'flex',
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexDirection: "row",
            paddingTop: "30px",
            gap: "80px"
        }}>
            <Roadmap features={features} placeholder={true}/>
        </div>
    )
}