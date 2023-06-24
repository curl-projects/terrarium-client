import Header from "~/components/Header/Header"
export default function PossibleFeatures(){
    return(
        <>
        <Header />
        <div style={{height: "100vh", width: "100vw", display: 'flex', alignItems: "center", justifyContent: "center"}}>
            <ol>
                <li>Interactive Search History</li>
                <li>Multiple pinned categories</li>
                <li>JSON File Upload</li>
                <li>Create pitch page</li>
                <li>Change the size of feature requests</li>
                <li>Improve possible features page to indicate roadmap for the product. Add thumbs up and thumbs down.</li>
                <li>Create a form associated with the bugs and requests page so that people can suggest improvements and see the improvements that they've suggested</li>
                <li>Update favicon</li>
                <li>Discord dataset converter</li>
                <li>Adjust prompt and specify the four columns: any dataset (JSON or csv) (Bug Reports/Feature Requests/Favourite Features)</li>
                <li>Add in local feature request keyword search</li>
            </ol>
        </div>
        </>
    )
}