import { Form, Link } from "@remix-run/react";


export default function FeatureHeader(){
  return(
    <div className='featureHeader'>
      <div className="navigationTextWrapper">
        <Link to ='/roadmap' style={{textDecoration: "none"}}>
          <h3 className='featureNavigationText'>Back</h3>
        </Link>
      </div>
      <div style={{flex: 1}}/>
      <Form action="/logout" method="post">
        <button className='featureLogoutButton'>Logout</button>
      </Form>
    </div>
  )
}
