export default function ToDo(){
    return(
        <div style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: 'center',
            fontSize: "20px",
            color: "#b0bfb9",
            fontWeight: 500,
            letterSpacing: "-.06em",
            gap: "10px",
        }}>
            <p>Fix the text styling for the case when there's no feature requests</p>
            <p>Fix the styling for the snackbar component</p>
            <p>Replace the placeholders in the landing page</p>
            <p>Prevent dataset deletion in the landing page</p>
            <p>Anonymise all data in the landing page</p>
            <p>Deploy all machine learning pipelines</p>
            <p>Create an introduction for specific users</p>
            <p>Create scroll arrows guiding people through the introduction</p>
            <p>Check the overflow styles for application components (e.g. roadmap, integrations, data sources).</p>
            <p>Check the entire workflow from beginning to end</p>
        </div>
    )
}