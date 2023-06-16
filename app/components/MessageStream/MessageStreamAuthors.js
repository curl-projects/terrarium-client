import { useState, useEffect } from 'react';

export default function MessageStreamAuthors(props){
    useEffect(()=>{
        console.log("AUTHOR INPUT DATA:", props.data)
    }, [props.data])
    
    return(
        <div>
            <p>Coming Soon</p>
        </div>
    )
}