import { createSlice } from "@reduxjs/toolkit";

const sidePanel = createSlice({
  name: "sidepanel",
  initialState: {
    inbox: {
      inboxList: [],
      inboxNotification: 0,
    },
    friends: { friendsList: [] },
    currentChatUser: {
      id: null,
      username: null,
      description: null,
      image: null,
      email: null,
    },
  },
  reducers: {
    setSidePanelInbox(state, action) {
      state.inbox = action.payload;
    },

    setFriendsList(state, action) {
      state.friends = action.payload;
    },

    setCurrentChatUser(state, action) {
      state.currentChatUser = action.payload;
    },
  },
});

export const { setSidePanelInbox, setFriendsList, setCurrentChatUser } =
  sidePanel.actions;
export default sidePanel.reducer;
