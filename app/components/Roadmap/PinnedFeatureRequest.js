import { useState } from 'react';

export default function PinnedFeatureRequest({ item, index }){
    const [open, setOpen] = useState(false);

    return(
    <div className='pinnedFRWrapper' key={index} onClick={() => setOpen(prevState => !prevState)}>
            <div className='pinnedFRTitleWrapper'><h1 className='pinnedFRTitle'>{item.featureRequest.fr ? item.featureRequest.fr : "No Feature Request"} | <b style={{fontWeight: 600}}>{item.feature ? item.feature : "No Feature"}</b></h1></div>
            <div className="pinnedFRAuthorWrapper"><p className="pinnedFRAuthor"><em>@{item.featureRequest ? item.featureRequest.author : "No Author"}</em></p></div>
            {open && (
                <div className="pinnedFRMessageWrapper"><p className='pinnedFRMessage'>{item.featureRequest ? item.featureRequest.message : "No Message"}</p></div>
            )}
        </div>
    )
}