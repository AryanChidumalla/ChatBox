import { useSelector } from "react-redux";
import EmptyProfileIcon from "../assets/emptyProfileIcon.svg";
import { useState } from "react";

export default function Chat() {
  const chatUserDetails = useSelector(
    (state) => state.reducer.sidePanel.currentChatUser
  );

  const [message, setMessage] = useState("");

  function handleSend() {
    if (message.length > 0) {
      console.log("Valid message");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: "red",
        borderRadius: "0px 10px 10px 0px",
      }}
    >
      <div
        style={{
          width: "calc(100% - 40px)",
          backgroundColor: "#FFDE95",
          padding: "20px",
          display: "flex",
          gap: "10px",
          borderRadius: "0px 10px 0px 0px",
          alignItems: "center",
        }}
      >
        {chatUserDetails.image === "" ? (
          <img
            src={EmptyProfileIcon}
            alt="Profile"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <img
            src={chatUserDetails.image}
            alt="Profile"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
          />
        )}
        <h4
          style={{
            color: "#323232",
            margin: "0",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {chatUserDetails.username}
        </h4>
      </div>
      <div style={{ flex: 1, backgroundColor: "green" }}>Messages</div>
      <div
        style={{
          width: "calc(100% - 40px)",
          backgroundColor: "#FFDE95",
          padding: "20px",
          display: "flex",
          gap: "10px",
          borderRadius: "0px 0px 10px 0px",
          alignItems: "center",
        }}
      >
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
