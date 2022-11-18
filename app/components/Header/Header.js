import { Form } from "@remix-run/react";



export default function Header(){
  return(
    <div className='header'>
      <div style={{flex: 1}}/>
      <Form action="/logout" method="post">
        <button className='logoutButton'>Logout</button>
      </Form>
    </div>
  )
}
