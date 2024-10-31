import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    clearUser(state) {
      state.user = null;
      state.userDetails = null;
    },
  },
});

export const { setUser, setUserDetails, clearUser } = auth.actions;
export default auth.reducer;
