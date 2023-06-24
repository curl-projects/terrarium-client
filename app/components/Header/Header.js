import { Form, Link } from "@remix-run/react";
import { RiPlantLine} from "react-icons/ri";
import { HiMenuAlt4 } from "react-icons/hi";

export default function Header(){
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
        <HiMenuAlt4 />
      </div>
    
      {/* <Form action="/logout" method="post">
        <button className='logoutButton'>Logout</button>
      </Form> */}
    </div>
  )
}
