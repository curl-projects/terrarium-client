import Header from "~/components/Header/Header"
export default function PossibleFeatures(){
    return(
        <>
        <Header />
        <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
            <ol>
                <li>Interactive Search History</li>
                <li>Editable Cluster Labels</li>
                <li>JSON File Upload</li>
                <li>Don't reload after pinning cards</li>
            </ol>
        </div>
        </>
    )
}