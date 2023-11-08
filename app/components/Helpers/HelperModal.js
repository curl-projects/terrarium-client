import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { RiPlantLine} from "react-icons/ri"
import { Fade } from 'react-awesome-reveal';
import TextTransition, { presets } from 'react-text-transition';

export default function HelperModal({modalOpen, setModalOpen, ...props}){

    const steps = [
        {
            target: "#tourFeatureQuestion",
            content: "Placeholder",
            disableBeacon: true,
            position: 'auto'
        },
        {
            target: "#tourWorkspaceScaffold",
            content: "Placeholder",
            disableBeacon: true,
        },
        {
            target: "#tourMessageStream",
            content: "Placeholder",
            disableBeacon: true,
        },
        {
            target: "#tourMessageStreamMetadata",
            content: "Placeholder",
            disableBeacon: true,
            placement: "left",

        },
        {
            target: "#tourNotepad",
            content: "Placeholder",
            disableBeacon: true,
            placement: "top",
        },
        {
            target: "#tourHeader",
            content: "Placeholder",
            disableBeacon: true,
        },
    ]

    const [modalIndex, setModalIndex] = useState(0)

    const [joyrideOpen, setJoyrideOpen] = useState(false)

    const [displayText, setDisplayText] = useState("placeholder")

    useEffect(()=>{
        setDisplayText(displayExampleQuestions[Math.floor(Math.random()*displayExampleQuestions.length)])
        const intervalId = setInterval(
            () => {
                setDisplayText(displayExampleQuestions[Math.floor(Math.random()*displayExampleQuestions.length)])
            },
            2000
        );

        return () => clearTimeout(intervalId)
    }, [])

    const displayExampleQuestions = [
        "How can I improve the usability of my tagging system?",
        "What are people most frustrated by?",
        "How can I improve my developer tools?",
        "Should I build a new interface for my newsfeed?",
        "What journalling functionality are people asking for most often?",
        "What should I build next?",
        "Should I build a system that allows users to upvote other people's content?",
        "Do people want to use my application offline?",
        "Which competitors should I be looking into?",
    ]

    useEffect(()=>{
        !modalOpen && setModalIndex(0)
    }, [modalOpen])

    useEffect(()=>{
        console.log("JOYRIDE OPEN:", joyrideOpen)
    }, [joyrideOpen])

    const modalCode = [
        <>
            <div className='instructionGeneralTextWrapper'>
                <Fade delay={500}>
                    <p className='instructionGeneralText'>This is a tool for exploring, visualizing and answering questions about data at scale</p>
                </Fade>
            </div>
                <Fade delay={1500} style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "20px",
                    }}>
                    <TextTransition 
                        className='instructionQuestionText'
                        direction="up"
                        springConfig={presets.gentle}>
                        {displayText}
                    </TextTransition>
                </Fade>
        </>
        ,
        <div className='instructionGeneralTextWrapper' style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,

        }}>
            <Fade delay={500}><p className='instructionGeneralText'>You have two jobs: asking the right question, and generating <span style={{color: "#7e988e"}}>Insights</span></p></Fade>
            <div className='instructionSubSplitWrapper'>
              <div style={{
                flex: 1,
                maxHeight: "30vh",

              }}>
                <Fade delay={1000} style={{height: "100%", padding: "10px",}}>
                    <div className='instructionComponentHighlighter'>
                        <Fade cascade delay={1000} style={{
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                        {[
                            'Students appreciate a split screen mode for the application so they can juggle their notes and resources',
                            "Drivers like being able to see their average rating over the last month",
                            "Researchers care more about the ability to search through references than perform keyword search",
                            "Collaborative annotation needs to happen in context or learners don't make difficult connections",
                            "Everyone really hates the current state of our integrations",
                        ].map(insight =>
                            <div className='insightsCard'>
                                <div className='insightsBookmark'/>
                                <div className='insightsInnerCard'>
                                    <p className='instructionInsightText'>{insight}</p>
                                </div>
                            </div>
                        )}
                        </Fade>
                    </div>
                </Fade>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: "center",
                justifyContent: 'center',
                flex: 1,
                padding: '15px',
              }}>
                    <div style={{flex: 1.}}/>
                    <Fade delay={2000}><p className='instructionParagraphText' style={{
                        textAlign: 'center',
                        color: "#b0bfb9",
                    }}>Insights are fragments of knowledge about your data, and are combined by Terrarium into a conceptual model of your community</p>
                    </Fade>
                    <div style={{flex: 1}}/>
                    <Fade delay={2000}><p className='instructionParagraphText' style={{
                        fontSize: "18px",
                        color: "#4b556399",
                    }}>They will be formalized in the next release of the application, and for now take the form of a notepad</p>
                    </Fade>
              </div>
            </div>
        </div>,
        <>
            <div style={{flex: 1}} />
            <div className='instructionGeneralTextWrapper' style={{
                padding: '40px',
            }}>
                <p className='instructionGeneralText'>To generate these insights, we've developed a suite of tools for data analysis</p>
            </div>
            <div style={{flex: 1}} />
        </>
    ]

    function handlePrevious(){
        setModalIndex(prevState=>prevState-1)
    }

    function handleNext(){
        if(modalIndex < modalCode.length - 1){
            setModalIndex(prevState=>prevState+1)
        }
        else{
            setModalOpen(false)
            setJoyrideOpen(true)
        }
    }

    function handleJoyrideCallback(data){
        const { action, index, status, type } = data;
        if([STATUS.FINISHED, STATUS.SKIPPED].includes(status)){
            setJoyrideOpen(false)
        }
    }

    return(
        <>
           <Modal 
            open={modalOpen}
            onClose={()=>setModalOpen(false)}
            >
            <div className='instructionModalWrapper'>
                <Fade duration={1500} style={{
                    height: "100%",
                }}>
                    <div className='instructionModalInnerWrapper'>
                        <h1 className='instructionWelcomeText'>
                            Welcome to
                            <span className='instructionLogo'>
                            <span className='instructionLogoPlant'>
                                <RiPlantLine style={{
                                    display: "inline",
                                    height: '46px',
                                    width: '46px',   
                                }}/>
                            </span>
                            Terrarium
                            </span>
                        </h1>
                        <div className='pageTitleDivider' style={{width: "80%", marginTop: "10px"}}/>
                        {modalCode[modalIndex]}
                        {modalIndex < modalCode.length - 1 ?
                            <div className='instructionNextWrapper'>
                                    {modalIndex > 0 &&
                                        <p className='instructionNextText'
                                            onClick={handlePrevious}
                                        >← Previous</p>
                                    }
                                    {modalIndex > 0 &&
                                        <p className='instructionNextText' style={{
                                            fontSize: '20px'
                                        }}>|</p>
                                    }
                                    <p className='instructionNextText'
                                        onClick={handleNext}
                                    >Next →</p>
                            </div>
                        :
                        <div className='instructionNextWrapper'>
                            <p className='instructionNextText'
                                onClick={handleNext}
                            >See what Terrarium can do →</p>
                        </div>          
                        }      
                    </div>
                </Fade>
            </div>
            
            </Modal>
           
            <div className='instructionModalButton'
                onClick={()=>setModalOpen(prevState => !prevState)}>
                <h1 className='instructionModalButtonIcon'>
                    ?
                </h1>
            </div>
            {joyrideOpen &&
                <Joyride 
                    steps={steps}
                    run={joyrideOpen}
                    tooltipComponent={Tooltip}
                    floaterProps={{hideArrow: true}}
                    spotlightClicks={true}
                    debug
                    callback={handleJoyrideCallback}
                    styles={{
                        options: {
                            maxWidth: "60vw"
                        }
                    }}
                />
            }
        </>
    )
}

function Navigation({backProps, primaryProps, isLastStep, closeProps, isFirstStep}){
    return(
        <div className='instructionNextWrapper'>
            {!isFirstStep &&
            <>
                <p {...backProps} className='instructionNextText'>
                    Previous
                </p>
                <p className='instructionNextText' style={{
                    fontSize: '20px'
                }}>|</p>
            </>
            }
            {!isLastStep ?
            <p {...primaryProps} className='instructionNextText'>
                Next
            </p>
            :
            <p {...closeProps} className='instructionNextText'>
                Close
            </p>
            }
        </div> 
    )
}

function Tooltip({
    continuous,
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep
  }){
    return(
        {
            0: <div {...tooltipProps} className='instructionModalJoyrideWrapper'>
                    <div className='instructionModalInnerWrapper'>
                        <h1 className='instructionToolDescriptionText'>
                        Adjust your question here as your understanding changes. The datapoints in your workspace will be adjusted, while those that you've pinned will remain.
                        </h1>
                        <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps} isFirstStep={index==0}/>
                    </div>
            </div>,
            1: <div {...tooltipProps} className='instructionModalJoyrideWrapper'>
                    <div className='instructionModalInnerWrapper'>
                            <h1 className='instructionToolDescriptionText'>
                            The 100 datapoints most relevant to your question are added to your workspace. The point field allows you to select regions, view clusters, and manipulate data-points. Soon, it will support organizing datapoints along semantic dimensions.
                            </h1>
                            <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps}/>

                    </div>
                </div>,
            2: <div {...tooltipProps} className='instructionModalJoyrideWrapper' style={{width: "80vw"}}>
                    <div className='instructionModalInnerWrapper'>
                            <h1 className='instructionToolDescriptionText'>
                            The data stream includes all of the metadata associated with each point, including the author, date, level of relevance and dataset. Each row represents a message summary, but you can click each card to show the original content. Each datapoint can be pinned to permanently associate it with the workspace. These pinned messages will form the basis of your insights.
                            </h1>
                            <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps}/>

                    </div>
                </div>,
            3: <div {...tooltipProps} className='instructionModalJoyrideWrapper'>
                    <div className='instructionModalInnerWrapper'>
                            <h1 className='instructionToolDescriptionText'>
                            The data stream also allows you to filter and search datapoints in many different ways, including a keyword search, filtering by author, date and and semantic cluster. As you perform filter and search operations, the point field and data stream adjust together. Check out the cluster panel and conduct a keyword search, if you're interested!
                            </h1>
                            <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps}/>

                    </div>
                </div>,
            4: <div {...tooltipProps} className='instructionModalJoyrideWrapper'>
                    <div className='instructionModalInnerWrapper'>
                            <h1 className='instructionToolDescriptionText'>
                            The notepad tab can be used to synthesize takeaways into a set of insights. We'll soon develop this much further into a structured process for generating a conceptual model.
                            </h1>
                            <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps}/>

                    </div>
                </div>,
            5: <div {...tooltipProps} className='instructionModalJoyrideWrapper'>
                    <div className='instructionModalInnerWrapper'>
                            <h1 className='instructionToolDescriptionText'>
                            All of your existing questions are saved in the Archive tab, where they can be organized into different categories. If you have any suggestions or come across any bugs, please report them in the Bugs & Extensions tab.
                            </h1>
                            <Navigation backProps={backProps} primaryProps={primaryProps} isLastStep={isLastStep} closeProps={closeProps}/>

                    </div>
                </div>,    
        }[index]   
    )}

// MODAL TEXT:
// Welcome to Terrarium! This is a tool for exploring and visualizing commmunity data
// You have two jobs: asking the right questions, and generating Insights
// Insights are fragments of knowledge about your community, and