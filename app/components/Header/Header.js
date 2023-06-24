import { Form, Link } from "@remix-run/react";
import { RiPlantLine} from "react-icons/ri";
import { HiMenuAlt4 } from "react-icons/hi";
import { RiLogoutBoxRLine } from "react-icons/ri"

import { useState } from "react"

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

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
    <div className='header'>
      <div className='headerTerrariumWrapper'>
        <Link to ='/roadmap'>
          <h1 className='headerTerrariumText'>
            <div className='terrarium-plant-wrapper'><RiPlantLine/></div>
            Terrarium
          </h1>
        </Link>
      </div>
      <div style={{flex: 1}}/>
      {!props.headerCollapsed &&
      <div className="navigationTextWrapper">
        <Link to ='/roadmap' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Roadmap</h3>
        </Link>
        <Link to ='/integrations' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Integrations</h3>
        </Link>
        <Link to ='/data-sources' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Data Sources</h3>
        </Link>
        <Link to ='/possible-features' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Possible Features</h3>
        </Link>
        <Link to ='/current-bugs' style={{textDecoration: "none"}}>
          <h3 className='navigationText'>Bugs</h3>
        </Link>
        <div className='headerOptionsWrapper'>
          <div className='headerOptionsButton' onClick={handleMenuClick}>
            <HiMenuAlt4 />
          </div>
        </div>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Form action="/logout" method="post">
            <MenuItem>
              <ListItemIcon>
                <RiLogoutBoxRLine />
              </ListItemIcon>
              <ListItemText>
                <button>
                  <p className='headerOptionsText' typ='submit'>Logout
                  </p>
                </button></ListItemText>
            </MenuItem>
          </Form>

        </Menu>
        
      </div>
      }
    </div>
  )
}
