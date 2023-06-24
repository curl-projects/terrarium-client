import RichTextEditor from "~/components/TextEditor/RichTextEditor"
import { ClientOnly } from "remix-utils";
import { useParams } from "@remix-run/react";

export default function Notepad(){
    const params = useParams();

    return(
        <div className='textEditorScaffold'>
            <ClientOnly>
            {() => <RichTextEditor
                    featureId={params["*"]} />}
            </ClientOnly> 
        </div>
    )
}