import { BsPlus } from "react-icons/bs";
import { useState, useEffect} from "react"
import { Form, useFetcher, useTransition } from "@remix-run/react";
import MessageCard from "./MessageCard";
import { BiCog } from "react-icons/bi"
import { Fade } from "react-awesome-reveal";

export default function MessageStreamAI(props){
    const [promptQuery, setPromptQuery] = useState("")
    const [aiMessages, setAiMessages] = useState([])
    const transition = useTransition()

    useEffect(()=>{
        setAiMessages(props.aiMessages)
    }, [props.aiMessages])

    useEffect(()=>{
        console.log("AGENT MESSAGES:", props.aiMessages)
    }, [props.aiMessages])

    const messageFetcher = useFetcher()

    function handleMessageClick(e){
        // update UI with message data
        setAiMessages(prevState => prevState.concat([{
            messageId: Math.max(...prevState.map(obj => obj.messageId)) + 1,
            agent: 'user',
            featureId: props.featureId,
            featureRequests: [],
            content: promptQuery
        }]))

        messageFetcher.submit({
            featureId: props.featureId,
            messageContent: promptQuery
        }, {
            method:'post',
            action: "/utils/ai-message-processing"
        })
        setPromptQuery("")
    }

    useEffect(()=>{
        console.log("MESSAGE FETCHER DATA:", messageFetcher.data)
    }, [messageFetcher.data])

    useEffect(()=>{
        console.warn("MESSAGE FETCHER STATE:", messageFetcher.state)
    }, [messageFetcher.state])

    return(
        <div className="pl-10 pr-8 flex flex-col gap-2" 
             style={{
                backgroundColor: "rgb(243, 244, 246)",
                height: '100%',
                paddingBottom: '26px',
                overflow: 'hidden',
                }}>
                <div className='chatStreamInnerWrapper'>
                    {(messageFetcher.state === 'submitting' || messageFetcher.state === 'loading') &&
                        <Fade className='chatStreamLoaderWrapper'>   
                            <BiCog
                                style={{fontSize: "26px", 
                                        transition: "color 0.5s ease-in",
                                        color: 'rgba(119, 153, 141, 0.89)'}} 
                                className={'animate-spin'}/>
                        </Fade>
                    }
                    {
                        aiMessages.sort((a,b) => b.messageId - a.messageId).map((message, idx) => 
                            message.agent === 'user' 
                            ?
                            <div key={idx} className='userMessageWrapper'>
                                <p className='userMessageName'>User</p>
                                <p className='userMessageContent'>{message.messageId}: {message.content}</p>
                            </div>
                            :
                            <Fade key={idx}>
                                <div key={idx} className='agentMessageWrapper'>
                                    <p className='agentMessageName'>Terrarium AI</p>
                                    <p className='agentMessageContent'>{message.messageId}: {message.content}</p>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    }}>
                                    {message.featureRequests.length !== 0 &&
                                        message.featureRequests.map((fr, idx) => 
                                            <MessageCard 
                                                idx={idx}
                                                key={fr.fr_id}
                                                cardData={fr}
                                                cardScore={fr.features[0].score}
                                                isPinned={props.pinnedCards.map(i => i.featureRequestId).includes(fr.fr_id)}
                                                pinCard={props.pinCard}
                                                unpinnable={true}
                                            />
                                        )
                                    }
                                    </div>
                                </div>
                            </Fade>
                            
                        )
                    }
                </div>
            <div className='textEditorPromptBarWrapper'>
                <input 
                    className='textEditorPromptBar' 
                    placeholder='AI Goes Here'
                    name='messageContent'
                    onKeyPress={(e)=>{e.key === "Enter" && handleMessageClick()}}
                    value={promptQuery} 
                    onChange={(e) => setPromptQuery(e.target.value)}
                    />
                {promptQuery !== "" &&
                    <button
                        className='promptButton'
                        onClick={handleMessageClick}
                        >
                        <BsPlus style={{fontSize: "34px"}}/>
                    </button>          
                }
            </div>
        </div>
    )
}