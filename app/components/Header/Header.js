import { Form, Link } from "@remix-run/react";


export default function Header(){
  return(
    <div className='header'>
      <div className="navigationTextWrapper">
        <Link to ='/integrations' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Integrations</h3>
        </Link>
        <Link to ='/roadmap' style={{textDecoration: "none"}}>
        <h3 className='navigationText'>Roadmap</h3>
        </Link>
      </div>
      <div style={{flex: 1}}/>
      <Form action="/logout" method="post">
        <button className='logoutButton'>Logout</button>
      </Form>
    </div>
  )
}
