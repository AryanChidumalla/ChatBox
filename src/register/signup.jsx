import { useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PasswordTextField from "./password";

import "./style.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";

import { useDispatch } from "react-redux";
import { show } from "../redux/reducer/formError";
import { setMessage } from "../redux/reducer/formErrorMessage";
import { doc, setDoc } from "firebase/firestore";

function SignUp({ setShowLogin }) {
  const username = useRef(null)
  const email = useRef(null)
  const password = useRef(null)
  const confirmPassword = useRef(null)

  const dispatch = useDispatch();

  async function SignUp() {
    let flag = 0

    if (username.current.value === '' || email.current.value === '' || password.current.value === '' || confirmPassword.current.value === '') {
      flag = 1
      dispatch(show())
      dispatch(setMessage('Please fill all the fields!'))
    } else if (password.current.value !== confirmPassword.current.value) {
      flag = 1
      dispatch(show())
      dispatch(setMessage('Passwords do not match'))
    }

    if (flag === 0) {
      // createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
      //   .then(async (userCredential) => {
      //     console.log(userCredential.user.uid)
      //     // const user = userCredential.user;
      //     // console.log("User signed up:", user);
      //     console.log('worked till here')
      //   })
      //   .catch((error) => {
      //     const errorCode = error.code
      //     // const errorMessage = error.message
      //     // console.error("Signup failed:", errorCode, errorMessage)
      //     dispatch(show())
      //     dispatch(setMessage(errorCode))
      //   });      

      const res = await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username: username.current.value,
        email: email.current.value, 
      })
    }
  }

  return (
    <>
      <div className="registerWrapper sign-up">
          <h4>Create your account!</h4>
          <form>
              <TextField label="Username" id="outlined-size-small" size="small" color="secondary" fullWidth inputRef={username} />
              <TextField label="Email" type="email" id="outlined-size-small" size="small" color="secondary" fullWidth inputRef={email} />
              <PasswordTextField label="Password" inputRef={password} />
              <PasswordTextField label="Confirm Password" inputRef={confirmPassword} />
              <Button variant="contained" onClick={SignUp} >Sign Up</Button>
          </form>
          <p>
              Already have an account?{" "}
              <span onClick={() => setShowLogin(true)}>Log In</span>
          </p>
      </div>    
    </>
  );
}

export default SignUp;
