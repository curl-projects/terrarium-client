import { BsPlus } from "react-icons/bs";
import { useState, useEffect} from "react"
import { Form, useFetcher, useTransition } from "@remix-run/react";
import MessageCard from "./MessageCard";

export default function MessageStreamAI(props){
    const [promptQuery, setPromptQuery] = useState("")
    const transition = useTransition()

    useEffect(()=>{
        console.log("AGENT MESSAGES:", props.aiMessages)
    }, [props.aiMessages])

    useEffect(()=>{
        transition.state === 'submitting' && setPromptQuery("")
        transition.submission && console.log("TRANSITION STATE:", transition.submission.formData.get("actionType"))
    }, [transition])

    const messageFetcher = useFetcher()

    useEffect(()=>{
        console.log("MESSAGE FETCHER DATA:", messageFetcher.data)
    }, [messageFetcher.data])

    return(
        <div className="pl-10 pr-8 flex flex-col gap-2" 
             style={{
                backgroundColor: "rgb(243, 244, 246)",
                height: '100%',
                paddingBottom: '26px',
                }}>
                <div className='chatStreamInnerWrapper'>
                    {
                        props.aiMessages.sort((a,b) => b.messageId - a.messageId).map((message, idx) => 
                            message.agent === 'user' 
                            ?
                            <div key={idx} className='userMessageWrapper'>
                                <p className='userMessageName'>User</p>
                                <p className='userMessageContent'>{message.messageId}: {message.content}</p>
                            </div>
                            :
                            <div key={idx} className='agentMessageWrapper'>
                                <p className='agentMessageName'>Terrarium AI</p>
                                <p className='agentMessageContent'>{message.messageId}: {message.content}</p>
                                {message.featureRequests.length !== 0 &&
                                    message.featureRequests.map((fr, idx) => 
                                        <MessageCard 
                                            idx={idx}
                                            key={fr.fr_id}
                                            cardData={fr}
                                            cardScore={fr.features[0].score}
                                            isPinned={props.pinnedCards.map(i => i.featureRequestId).includes(fr.fr_id)}
                                            pinCard={props.pinCard}
                                        />
                                    )
                                }
                            </div>
                            
                        )
                    }
                </div>
            <messageFetcher.Form className='textEditorPromptBarWrapper' method='post' action="/utils/ai-message-processing">
                <input 
                    className='textEditorPromptBar' 
                    placeholder='AI Goes Here'
                    name='messageContent'
                    value={promptQuery} 
                    onChange={(e) => setPromptQuery(e.target.value)}
                    />
                <input type='hidden' name='actionType' value="messageSave"/>
                <input type='hidden' name='featureId' value={props.featureId}/>
                {promptQuery !== "" &&
                    <button
                        className='promptButton'
                        type="submit"
                        >
                        <BsPlus style={{fontSize: "34px"}}/>
                    </button>          
                }
            </messageFetcher.Form>
        </div>
    )
}