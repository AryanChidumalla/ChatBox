import { createSlice } from "@reduxjs/toolkit";

const chat = createSlice({
  name: "chat",
  initialState: {
    currentChat: [], // Default value: no active chat
  },
  reducers: {
    setCurrentChat(state, action) {
      state.currentChat = action.payload; // Set the current active chat
    },
  },
});

export const { setCurrentChat, setChatList } = chat.actions;
export default chat.reducer;
