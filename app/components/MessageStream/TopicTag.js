import { useEffect } from 'react';

export default function TopicTag(props){

    return(
        <>
            {props.idx !== 0 && <div className='altTagSeparator'/>}
            <p className="altTagText">{props.clusterTag.tagContent}</p>
        </>
    )
}