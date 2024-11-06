import { createSlice } from "@reduxjs/toolkit";

const chat = createSlice({
  name: "chat",
  initialState: {
    currentChat: [], // Default value: no active chat
    chatList: [],
  },
  reducers: {
    setCurrentChat(state, action) {
      state.currentChat = action.payload; // Set the current active chat
    },

    setChatList(state, action) {
      state.chatList = action.payload; // Set the chat list
    },
  },
});

export const { setCurrentChat, setChatList } = chat.actions;
export default chat.reducer;
