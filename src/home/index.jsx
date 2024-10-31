import { useState } from "react";
import { logoutUser } from "../firebase/firebaseFunctions";
import Sidepanel from "./sidepanel/sidepanel";

import AllChatsIcon from "../assets/allChatsIcon.svg";
import PrivateChatsIcon from "../assets/privateChatIcon.svg";
import GroupChatsIcon from "../assets/groupChatIcon.svg";
import InboxIcon from "../assets/inboxIcon.svg";
import AddFriendIcon from "../assets/addFriendIcon.svg";
import MyProfileIcon from "../assets/myProfileIcon.svg";
import SettingsIcon from "../assets/settingsIcon.svg";
import { StyledButtonWithIcon } from "../mui-templates/button";
// import { SidePanel } from "./sidepanel/sidepanel";

function Home() {
  const [sidePanel, setSidePanel] = useState("All Chats");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          backgroundColor: "#FDFDFD",
          borderRadius: "10px",
          width: "80%",
          height: "80%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 80px)",
            width: "fit-content",
            padding: "40px 20px",
            borderRight: "1px solid #323232",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <StyledButtonWithIcon
              label="All Chats"
              icon={AllChatsIcon}
              onClick={() => setSidePanel("All Chats")}
            />
            <StyledButtonWithIcon
              label="Private Chats"
              icon={PrivateChatsIcon}
              onClick={() => setSidePanel("Private Chats")}
            />
            <StyledButtonWithIcon
              label="Group Chats"
              icon={GroupChatsIcon}
              onClick={() => setSidePanel("Group Chats")}
            />
            <StyledButtonWithIcon
              label="Inbox"
              icon={InboxIcon}
              onClick={() => setSidePanel("Inbox")}
            />
            <StyledButtonWithIcon
              label="Add Friend"
              icon={AddFriendIcon}
              onClick={() => setSidePanel("Add Friend")}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <StyledButtonWithIcon
              label="My Profile"
              icon={MyProfileIcon}
              onClick={() => setSidePanel("My Profile")}
            />
            <StyledButtonWithIcon
              label="Settings"
              icon={SettingsIcon}
              onClick={() => setSidePanel("Settings")}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "calc(100% - 80px)",
            width: "20%",
            padding: "40px 20px",
          }}
        >
          {" "}
          <Sidepanel SidePanelName={sidePanel} />
        </div>
        <div
          style={{
            backgroundColor: "#FFDE95",
            flex: 1,
            borderRadius: "0px 10px 10px 0px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Home;
