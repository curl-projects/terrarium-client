import { useEffect, useState } from "react";
import { useFetcher, useParams } from "@remix-run/react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { BiCalendar } from "react-icons/bi"; 
import { BsX } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs"
import { BsPlus } from "react-icons/bs";
import { FiEye } from "react-icons/fi"
import { FiEyeOff } from "react-icons/fi"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Tooltip from '@mui/material/Tooltip';
import Autocomplete from '@mui/material/Autocomplete';

dayjs.extend(utc)

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
    const [authorValue, setAuthorValue] = useState("")
    const params = useParams()
    const [filters, setFilters] = useState([])
    const [filterSelected, setFilterSelected] = useState("")
    const [authorFilterSelected, setAuthorFilterSelected] = useState(false)
    const [dateFilterOption, setDateFilterOption] = useState("")
    const filterFetcher = useFetcher();

    function handleAddFilter(e, type){

        if(type === 'date'){
            filterFetcher.submit({requestType: "create", featureId: params['*'], 
            type: "date", dateVariant: dateFilterOption, date: dateValue}, 
           { method: "post", action: "/utils/create-filter"})
        }
        else if(type === 'author'){
            filterFetcher.submit({requestType: "create", featureId: params['*'], 
            type: "author", author: authorValue}, 
           { method: "post", action: "/utils/create-filter"})
        }

        setFilterSelected("")
        setAuthorValue("")
    }

    function handleDeleteFilter(filterId){
        filterFetcher.submit({requestType: "delete", filterId: filterId},
                             { method: "post", action: "/utils/create-filter"})
    }

    useEffect(()=>{
        console.log('FILTERS:', props.filters)
    }, [props.filters])

    function handleInvisibleFilters(e, filterId){
        props.setInvisibleFilters(function(prevState){
            if(prevState.includes(filterId)){
                const newState = prevState.filter(x => x !== filterId)
                return newState
            }
            else{
                return [...prevState, filterId]
            }
        })
    }


    return(
        <div className='filtersOuterWrapper'>
            <div className='newFilterBox'>
                <div className='filterOptionsBar'>
                    <Tooltip title="Filter by Date" placement='top' arrow>
                        <button
                            className='filterOptionButton'
                            onClick={()=>setFilterSelected(prevState => prevState === 'date' ? "" : 'date')}
                            style={{backgroundColor: filterSelected === 'date' ? 'rgba(119, 153, 141, 0.85)' : "#fff"}}>
                                <BiCalendar />
                        </button>
                    </Tooltip>
                    <Tooltip title='Filter by Author' placement='top' arrow>
                        <button 
                            className='filterOptionButton'
                            onClick={()=>setFilterSelected(prevState => prevState === 'author' ? "" : 'author')}
                            style={{backgroundColor: filterSelected === 'author' ? 'rgba(119, 153, 141, 0.85)' : "#fff"}}>
                                <BsFillPersonLinesFill />
                        </button>
                    </Tooltip>
                </div>
            <div className='filterOptionSeparator'/>
            {filterSelected === 'date' &&
                <>
                    <div className='dateOptionsBar'>
                        {['before', 'during', 'after'].map((option) =>
                            <button 
                                key={option}
                                className='dateOptionButton'
                                onClick={()=>setDateFilterOption(option)}
                                style={{backgroundColor: dateFilterOption === option && 'rgba(119, 153, 141, 0.5)'}}>
                                    <p className='dateVariantOptionsText'>{option}</p>
                            </button>
                        )}
                    </div>
                    <div className='datePickerBar'>
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
                                    setDateValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} helperText={null} className='datePickerTextField'/>}
                            />
                        </LocalizationProvider>
                        {filterSelected === 'date' && dateFilterOption && dayjs(dateValue).isValid() &&
                            <button
                                className='filterOptionButton'
                                onClick={(e) => handleAddFilter(e, 'date')}>
                                    <BsPlus style={{fontSize: "34px"}}/>
                            </button>                        
                        }

                    </div>
    
                </>
            }
            {filterSelected === 'author' &&
                <>
                    {props.filters.some(x => x.type === 'author') &&
                        <div className='filterAuthorErrorWrapper'>
                            <p className='filterAuthorErrorText'>Only one author filter can be active at once.</p>
                        </div>
                    }
                    <div className='authorSelectInputWrapper'>
                    {!props.filters.some(x => x.type === 'author') &&
                        <div className='authorPickerBar'>
                            <Autocomplete 
                                    options={props.authorNames}
                                    renderInput={(params) => <TextField {...params} label="Author" className='authorPickerTextField'/>}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <p style={{color: "rgba(55, 65, 81, 0.7)", fontWeight: '400', letterSpacing: "-0.03em"}}>{option}</p>
                                        </Box>
                                    )}
                                    inputValue={authorValue}
                                    style={{width: "100% !important"}}
                                    onInputChange={(event, newInputValue) => {
                                    setAuthorValue(newInputValue)
                                    }}
                            />
                        {filterSelected === 'author' && authorValue && 
                            <button
                            className='filterOptionButton'
                            onClick={(e) => handleAddFilter(e, 'author')}>
                                <BsPlus style={{fontSize: "34px"}}/>
                            </button>   
                        }   
                        </div>
                    }
                    </div>
                </>
            }

            </div>
          <div className="activeFiltersWrapper">
            {props.filters.map((filter, idx) =>        
                <div className='filterBox' key={idx}>
                    <div className='filterIconWrapper'>
                        {
                            {
                                "author": <BsFillPersonLinesFill style={{fontSize: "24px", color: "rgba(75, 85, 99, 0.85)"}}/>,
                                "date": <BiCalendar style={{fontSize: "26px", color: "rgba(75, 85, 99, 0.85)"}}/>
                            }[filter.type]
                        }
                    </div>
                    <div className='filterContentWrapper'>
                        <p className='filterContentText'>Filter By {titleize(filter.type)} |  
                            <span className='innerFilterContentText'>
                                {
                                    {
                                        "author": <span> {filter.author}</span>,
                                        "date": filter.dateVariant && <span> {titleize(filter.dateVariant)} {dayjs(filter.date).format("YYYY")}</span>
                                    }[filter.type]
                                }
                            </span>
                        </p>
                    </div>
                    <div style={{flex: 1}}/>
                    <div className='filterControlsWrapper'>
                            {props.invisibleFilters.includes(filter.filterId)
                                ? 
                                <Tooltip title='Toggle Visibility' arrow placement='top'>
                                    <FiEyeOff
                                        onClick={(e) => handleInvisibleFilters(e, filter.filterId)}
                                        style={{fontSize: "20px", color: "#4B556399", cursor: "pointer"}}
                                    />
                                </Tooltip>
                                : 
                                <Tooltip title='Toggle Visibility' arrow placement='top'>
                                    <FiEye
                                        onClick={(e) => handleInvisibleFilters(e, filter.filterId)}
                                        style={{fontSize: "20px", color: "#4B556399", cursor: "pointer"}}
                                        />
                                </Tooltip>
                            }
                        <Tooltip title="Delete Filter" arrow placement='top'>
                            <BsX 
                                onClick={() => handleDeleteFilter(filter.filterId)}
                                style={{fontSize: "28px", color: "#4B556399", cursor: "pointer"}}/>
                        </Tooltip>
                    </div>
                </div>
            )}
          </div>
        </div>

    )
}