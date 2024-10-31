import { createSlice } from '@reduxjs/toolkit';

const showFormError = createSlice({
  name: 'FormError',
  initialState: false,
  reducers: {
    show(state) {
      return true;
    },
    hide(state) {
      return false;
    },
  },
});

export const { show, hide } = showFormError.actions;
export default showFormError.reducer;