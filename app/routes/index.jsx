import { Form, useSubmit } from "@remix-run/react";
import { SocialsProvider } from "remix-auth-socials";
import terrarium from "../../public/assets/terrarium.png"

const CONTAINER_STYLES = {
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const BUTTON_STYLES = {
  padding: "15px 25px",
  background: "#dd4b39",
  border: "0",
  outline: "none",
  cursor: "pointer",
  color: "white",
  fontWeight: "bold",
};

export default function Index(){
  const submit = useSubmit();

  function handleSubmit(event){
    submit(event.currentTarget)
  }

  return (
    <div style={CONTAINER_STYLES}>
      <Form
          method="post"
          action={`/auth/${SocialsProvider.GOOGLE}`}
          onClick={handleSubmit}
          style={{cursor: "pointer", display: "flex", justifyContent: "center", flexDirection: "row"}}
          >
      <h1 className="terrarium-logo">Terrarium | <span className='terrarium-login'>Log In</span></h1>
      </Form>
    </div>
  );
};

// <button style={BUTTON_STYLES}>Login with Google</button>
{/* <img className='terrarium' src={terrarium}></img>
          <div style={{textAlign: 'center', marginTop: "5px"}}>
            <h3 className='logInText'>Log In</h3>
          </div> */}