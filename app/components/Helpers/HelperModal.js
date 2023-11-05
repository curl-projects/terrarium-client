import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Joyride from 'react-joyride';
import { RiPlantLine} from "react-icons/ri"
import { Fade } from 'react-awesome-reveal';



export default function HelperModal({modalOpen, setModalOpen, ...props}){
    return(
        <>
           <Modal 
            open={modalOpen}
            onClose={()=>setModalOpen(false)}
            >
            <div className='instructionModalWrapper'>
                <Fade duration={1500}>
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
        </>
    )
}

// MODAL TEXT:
// Welcome to Terrarium! This is a tool for exploring and visualizing commmunity data
// You have two jobs: asking the right questions, and generating Insights
// Insights are fragments of knowledge about your community, and