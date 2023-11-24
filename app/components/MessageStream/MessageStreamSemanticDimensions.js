import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CgArrowsShrinkH } from "react-icons/cg";
import Tooltip from '@mui/material/Tooltip';

export default function MessageStreamSemanticDimensions(props){
    const dimOptions = [
        'Relevance',
        "Engineering Lift",
        "Usefulness",
        "Specificity"
    ]

    const dimDescriptions = {
        'Relevance': "A measure of how related the feature request is to the search that you're conducting",
        "Engineering Lift": "A measure of how challenging the feature would be to build technically",
        "Usefulness": "A measure of how much more useful the software would become if the feature were implemented",
        "Specificity": "A measure of how granular the feature request is -- whether it describes a small change to a single screen, or a large set of improvements"
    }

    return(
        <div className="semanticDimWrapper">
            <div className='semanticDimRow'>
                <div className='semanticDimLabel'>
                    <p className='semanticDimLabelText'>X Axis</p>
                    <div style={{flex: 1}}/>
                    <Tooltip title='Normalize Data' placement='top' arrow>
                        <div className='semanticDimOptionButton'
                             style={{backgroundColor: props.semanticDimensions[0].normalized ? 'rgba(119, 153, 141, 0.4)' : "#fff"}}
                             onClick={()=>props.setSemanticDimensions(prevState => [{dimension: prevState[0].dimension, normalized: !prevState[0].normalized}, prevState[1]])}>
                            <CgArrowsShrinkH />
                        </div>
                    </Tooltip>
                </div>
                <div className='semanticDimInputWrapper'>
                <Select 
                    className='semanticDimInputSelect'
                    value={props.semanticDimensions[0].dimension}
                    onChange={function(e){
                        props.setSemanticDimensions(prevState => [{dimension: e.target.value, normalized: false}, prevState[1]])
                    }}
                >
                    {dimOptions.map((option, idx) => 
                        <MenuItem className='semanticDimMenuItem' key={idx} value={option}>{option}</MenuItem>
                    )}
                </Select>
                <div style={{flex: 1}}/>
                </div>
                <div className='semanticDimDescriptionWrapper'>
                    <p className='semanticDimDescriptionText'>
                        {dimDescriptions[props.semanticDimensions[0].dimension]}
                    </p>
                </div>
            </div>
            <div className='semanticDimRow'>
                <div className='semanticDimLabel'>
                    <p className='semanticDimLabelText'>Y Axis</p>
                    <div style={{flex: 1}}/>
                    <Tooltip title='Normalize Data' placement='top' arrow>
                        <div className='semanticDimOptionButton'
                            style={{backgroundColor: props.semanticDimensions[1].normalized ? 'rgba(119, 153, 141, 0.4)' : "#fff"}}
                            onClick={()=>props.setSemanticDimensions(prevState => [prevState[0], {dimension: prevState[1].dimension, normalized: !prevState[1].normalized},])}>
                            <CgArrowsShrinkH />
                        </div>
                    </Tooltip>
                </div>
                <div className='semanticDimInputWrapper'>
                <Select 
                    className='semanticDimInputSelect'
                    value={props.semanticDimensions[1].dimension}
                    onChange={function(e){
                        props.setSemanticDimensions(prevState => [prevState[0], {dimension: e.target.value, normalized: false}])
                    }}
                >
                    {dimOptions.map((option, idx) => 
                        <MenuItem className='semanticDimMenuItem' key={idx} value={option}>{option}</MenuItem>
                    )}
                </Select>
                <div style={{flex: 1}}/>
                </div>
                <div className='semanticDimDescriptionWrapper'>
                    <p className='semanticDimDescriptionText'>
                        {dimDescriptions[props.semanticDimensions[1].dimension]}
                    </p>
                </div>
            </div>
        </div>
    )
}