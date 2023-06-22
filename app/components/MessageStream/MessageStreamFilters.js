import { useState } from "react";
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';

import dayjs from 'dayjs';

function titleize(str) {
    let upper = true
    let newStr = ""
    for (let i = 0, l = str.length; i < l; i++) {
        // Note that you can also check for all kinds of spaces  with
        // str[i].match(/\s/)
        if (str[i] == " ") {
            upper = true
            newStr += str[i]
            continue
        }
        newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase()
        upper = false
    }
    return newStr
}


export default function MessageStreamFilters(props){
    const [dateValue, setDateValue] = useState("")
    const [filters, setFilters] = useState([])
    const [dateFilterSelected, setDateFilterSelected] = useState(false)
    const [dateFilterOption, setDateFilterOption] = useState("")


    function handleAddFilter(){
        setDateFilterOption("")
    }

    return(
        <div className='filtersOuterWrapper'>
            <div className='newFilterBox'>
                <div className='filterOptionsBar'>
                    <p className='filterByText'>Filter By:</p>
                    <button 
                        className='filterOptionButton'
                        onClick={()=>setDateFilterSelected(!dateFilterSelected)}
                        style={{backgroundColor: dateFilterSelected ? '#B0BFB9' : "#fff"}}>
                            Date
                    </button>
                </div>
            {dateFilterSelected &&
                <>
                    <div className='dateOptionsBar'>
                        {['before', 'during', 'after'].map((option) =>
                            <button 
                                key={option}
                                className='filterOptionButton'
                                onClick={()=>setDateFilterOption(option)}
                                style={{backgroundColor: dateFilterOption === option ? '#77998DB3' : "#fff"}}>
                                    <p style={{textTransform: "capitalize"}}>{option}</p>
                            </button>
                        )}
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            views={['year']}
                            label={titleize(dateFilterOption)}
                            minDate={dayjs('2012-01-01')}
                            disableFuture={true}
                            value={dateValue}
                            openTo="year"
                            formatDensity="spacious"
                            onChange={(newValue) => {
                                console.log("newVALUE!:", newValue)
                                setDateValue(newValue);
                                props.filterDateData(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} className='datePickerTextField'
                            />}
                        />
                    </LocalizationProvider>
                    <button onClick={handleAddFilter}>Add Filter</button>
                </>
            }

            </div>
            
            
          <button onClick={()=>props.resetDateData()}>Remove filter</button>
        </div>

    )
}