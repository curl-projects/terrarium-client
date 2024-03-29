import { Form, Link } from "@remix-run/react";
import { RiPlantLine} from "react-icons/ri";
import { HiMenuAlt4 } from "react-icons/hi";
import { HiLogout } from "react-icons/hi"

import { useState } from "react"

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import Tooltip from '@mui/material/Tooltip';

export default function Header(props){
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  }

  return(
    <div className='header' style={{gridColumn: "1 / 4", gridRow: "1 / 2"}}>
    <Tooltip title='Your new favourite app' placement='bottom' arrow>
      <div className='headerTerrariumWrapper'>
          <h1 className='headerTerrariumText'>
            <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
            Terrarium
          </h1>
      </div>
      </Tooltip>
      <div style={{flex: 1}}/>
      {!props.headerCollapsed &&
      <div className="navigationTextWrapper">
        <Tooltip title="Create and organise topics & features" placement='bottom' arrow>
        <h3 className='navigationText'>Roadmap</h3>
        </Tooltip>
        <Tooltip title="Connect Discord and Other Platforms" placement='bottom' arrow>
        <h3 className='navigationText'>Integrations</h3>
        </Tooltip>
        <Tooltip title="Upload and work with datasets" placement='bottom' arrow>
        <h3 className='navigationText'>Data Sources</h3>
        </Tooltip>
        <Tooltip title="Bugs, New Features & Requests" placement='bottom' arrow>
        <h3 className='navigationText'>Possible Features</h3>
        </Tooltip>
        {/* <Link to ='/curr ent-bugs' style={{textDecoration: "none"}}>
          <h3 className='navigationText'>Bugs</h3>
        </Link> */}
        <Tooltip title="Logout" placement='bottom' arrow>
          <button type='submit'>
            <p className='navigationText'>
              <HiLogout />
            </p>
          </button>    
        </Tooltip>    
      </div>
      }
    </div>
  )
}
