import { createSlice } from '@reduxjs/toolkit';

const formErrorMessage = createSlice({
    name: 'FormErrorMessage',
    initialState: '',
    reducers: {
      setMessage(state, action) {
        return action.payload
      },
      clearMessage(state) {
        return ''
      }
    }
  })
  
  export const { setMessage, clearMessage } = formErrorMessage.actions;
  export default formErrorMessage.reducer