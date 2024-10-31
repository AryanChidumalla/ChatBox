import { combineReducers } from "@reduxjs/toolkit";

import showFormError from "./formError";
import formErrorMessage from "./formErrorMessage";
import auth from "./auth";

const rootReducer = combineReducers({
  error: showFormError,
  errorMsg: formErrorMessage,
  auth: auth,
});

export default rootReducer;
