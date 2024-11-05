import { combineReducers } from "@reduxjs/toolkit";

import showFormError from "./formError";
import formErrorMessage from "./formErrorMessage";
import auth from "./auth";
import sidePanel from "./sidepanel";
import chat from "./chat";

const rootReducer = combineReducers({
  error: showFormError,
  errorMsg: formErrorMessage,
  auth: auth,
  sidePanel: sidePanel,
  chat: chat,
});

export default rootReducer;
