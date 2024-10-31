import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './redux/reducer/index';
import showFormError from './redux/reducer/formError'

const store = configureStore({
  // reducer: {
  //   counter: counterSlice
  // },
  // reducer: {
  //   error: showFormError
  // }
  reducer: {
    reducer: rootReducer
  }
});

export default store;
