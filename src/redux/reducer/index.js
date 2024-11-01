import { combineReducers } from "@reduxjs/toolkit";

import showFormError from "./formError";
import formErrorMessage from "./formErrorMessage";
import auth from "./auth";
import sidePanel from "./sidepanel";

const rootReducer = combineReducers({
  error: showFormError,
  errorMsg: formErrorMessage,
  auth: auth,
  sidePanel: sidePanel,
});

export default rootReducer;
