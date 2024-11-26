import "./style.css";
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hide, show } from "../redux/reducer/formError";
import { clearMessage, setMessage } from "../redux/reducer/formErrorMessage";
import { Alert, Snackbar } from "@mui/material";
import {
  StyledPasswordTextField,
  StyledTextfield,
} from "../mui-templates/textfield";
import {
  registerUser,
  loginUser,
  getUserDetails,
} from "../firebase/firebaseFunctions";
import { setUser, setUserDetails } from "../redux/reducer/auth";
import { StyledButtonForRegister } from "../mui-templates/button";

function Register() {
  const [showLogin, setShowLogin] = useState(true);
  const dispatch = useDispatch();

  // Track loading state for async operations
  const [isLoading, setIsLoading] = useState(false);

  const bool = useSelector((state) => state.reducer.error);
  const message = useSelector((state) => state.reducer.errorMsg);

  function hideError() {
    dispatch(hide());
    dispatch(clearMessage());
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#323232",
          margin: "0",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        ChatBox
      </h1>
      <div
        className={`registerContainer ${
          showLogin ? "animate-signup" : "animate-login"
        }`}
      >
        <LogIn
          setShowLogin={setShowLogin}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <SignUp
          setShowLogin={setShowLogin}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
      {bool ? (
        <div className="ErrorContainer">
          <Snackbar
            open={bool}
            autoHideDuration={3000}
            onClose={hideError}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={hideError} severity="error" sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
        </div>
      ) : null}
    </div>
  );
}

function LogIn({ setShowLogin, isLoading, setIsLoading }) {
  const email = useRef(null);
  const password = useRef(null);
  const dispatch = useDispatch();

  // Log In function
  async function handleLogin() {
    if (email.current.value === "" || password.current.value === "") {
      dispatch(show());
      dispatch(setMessage("Please fill all the fields!"));
    } else {
      try {
        setIsLoading(true); // Set loading to true while logging in
        const user = await loginUser(
          email.current.value,
          password.current.value
        );

        const serializableUser = {
          uid: user.uid,
          email: user.email,
        };

        const userDetails = await getUserDetails(user.uid);

        dispatch(setUser(serializableUser));
        dispatch(setUserDetails(userDetails));
      } catch (error) {
        console.log(error);
        dispatch(show());
        dispatch(setMessage(error.message));
      } finally {
        setIsLoading(false); // Reset loading after operation
      }
    }
  }

  return (
    <div className="registerWrapper log-in">
      <h4>Log In to your account!</h4>
      <form>
        <StyledTextfield label="Email" inputRef={email} />
        <StyledPasswordTextField label="Password" inputRef={password} />
        <StyledButtonForRegister
          onClick={handleLogin}
          label={isLoading ? "Logging in..." : "Log In"}
          disabled={isLoading}
        />
      </form>
      <p>
        Don't have an account?
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => setShowLogin(false)}
        >
          {" "}
          Sign Up
        </span>
      </p>
    </div>
  );
}

function SignUp({ setShowLogin, isLoading, setIsLoading }) {
  const username = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const dispatch = useDispatch();

  // Sign Up function
  async function handleSignUp() {
    let flag = 0;

    if (
      username.current.value === "" ||
      email.current.value === "" ||
      password.current.value === "" ||
      confirmPassword.current.value === ""
    ) {
      flag = 1;
      dispatch(show());
      dispatch(setMessage("Please fill all the fields!"));
    } else if (password.current.value !== confirmPassword.current.value) {
      flag = 1;
      dispatch(show());
      dispatch(setMessage("Passwords do not match"));
    }

    if (flag === 0) {
      try {
        setIsLoading(true); // Set loading to true while signing up
        const user = await registerUser(
          username.current.value,
          email.current.value,
          password.current.value
        );

        const serializableUser = {
          uid: user.uid,
          email: user.email,
        };

        dispatch(setUser(serializableUser));
      } catch (error) {
        dispatch(show());
        dispatch(setMessage(error.message));
      } finally {
        setIsLoading(false); // Reset loading after operation
      }
    }
  }

  return (
    <div className="registerWrapper sign-up">
      <h4>Create your account!</h4>
      <form>
        <StyledTextfield label="Username" inputRef={username} />
        <StyledTextfield label="Email" inputRef={email} />
        <StyledPasswordTextField label="Password" inputRef={password} />
        <StyledPasswordTextField
          label="Confirm Password"
          inputRef={confirmPassword}
        />
        <StyledButtonForRegister
          onClick={handleSignUp}
          label={isLoading ? "Signing up..." : "Sign Up"}
          disabled={isLoading}
        />
      </form>
      <p>
        Already have an account?
        <span
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => setShowLogin(true)}
        >
          {" "}
          Log In
        </span>
      </p>
    </div>
  );
}

export default Register;
