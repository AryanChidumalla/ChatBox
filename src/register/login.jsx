import { useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PasswordTextField from "./password";

import "./style.css";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

import { useDispatch } from "react-redux";
import { show } from "../redux/reducer/formError";
import { setMessage } from "../redux/reducer/formErrorMessage";

function LogIn({ setShowLogin }) {
  const email = useRef(null);
  const password = useRef(null);

  const dispatch = useDispatch();

  function LogIn() {
    if (email.current.value === '' || password.current.value === '') {
      dispatch(show())
      dispatch(setMessage('Please fill all the fields!'))
    } else {
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then(function(user) {
          // console.log(user)
        })
        .catch(function(error) {
          const errorCode = error.code
          // const errorMessage = error.message
          // console.error("Signup failed:", errorCode, errorMessage)
          dispatch(show())
          dispatch(setMessage(errorCode))
        })      
    }
  }

  return (
    <div className="registerWrapper log-in">
        <h4>Log In to your account!</h4>
        <form>
            <TextField label="Email" id="outlined-size-small" size="small" color="secondary" fullWidth inputRef={email}/>
            <PasswordTextField label="Password" inputRef={password}/>
            {/* <TextField label="Password" id="outlined-size-small" size="small" color="secondary" inputRef={password}/> */}
            <Button variant="contained" onClick={LogIn}>Log In</Button>
        </form>
        <p>
            Don't have an account?{" "}
            <span onClick={() => setShowLogin(false)}>Sign Up</span>
        </p>
    </div>
  );
}

export default LogIn;
