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
      <div className='headerTerrariumWrapper'>
        <Link to ='/query'>
          <h1 className='headerTerrariumText'>
            <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
            Terrarium
          </h1>
        </Link>
      </div>
      <div style={{flex: 1}}/>
      {!props.headerCollapsed &&
      <div className="navigationTextWrapper">
        <Link to ='/data-sources-example' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Data Sources</h3>
        </Link>
        <Link to ='/query' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Query</h3>
        </Link>
        <Link to ='/archive' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Archive</h3>
        </Link>
        {/* <Link to ='/integrations' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Integrations</h3>
        </Link> */}
        <Link to ='/extensions' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Bugs & Extensions</h3>
        </Link>
        {/* <Link to ='/curr ent-bugs' style={{textDecoration: "none"}}>
          <h3 className='navigationText'>Bugs</h3>
        </Link> */}
        
          <Form method='post' action='/logout' style={{display: 'flex'}}>
            <Tooltip title="Logout" placement='bottom' arrow>
              <button type='submit'>
                <p className='navigationText'>
                  <HiLogout />
                </p>
              </button>  
            </Tooltip>    
          </Form>  
        
      </div>
      }
    </div>
  )
}
