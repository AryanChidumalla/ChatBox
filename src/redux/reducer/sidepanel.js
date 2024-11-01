import { createSlice } from "@reduxjs/toolkit";

const sidePanel = createSlice({
  name: "sidepanel",
  initialState: {
    inbox: {
      inboxList: [],
      inboxNotification: 0,
    },
  },
  reducers: {
    setSidePanelInbox(state, action) {
      state.inbox = action.payload;
    },
  },
});

export const { setSidePanelInbox } = sidePanel.actions;
export default sidePanel.reducer;
