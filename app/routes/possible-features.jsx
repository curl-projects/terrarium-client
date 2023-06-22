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
                <li>See all authors</li>
                <li>Filter by date and allow for search</li>
                <li>Add scores into feature request cards and sort by scores</li>
                <li>Fix loading circle for notpad</li>
                <li>Create pitch page</li>
                <li>Change colours of the roadmap</li>
                <li>Change the size of feature requests</li>
                <li>Fix the roadmap metadata feature request counts</li>
                <li>Improve possible features page to indicate roadmap for the product. Add thumbs up and thumbs down.</li>
                <li>Create a form associated with the bugs and requests page so that people can suggest improvements and see the improvements that they've suggested</li>
            </ol>
        </div>
        </>
    )
}