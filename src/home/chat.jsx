import { useDispatch, useSelector } from "react-redux";
import EmptyProfileIcon from "../assets/emptyProfileIcon.svg";
import { useEffect, useState } from "react";
import {
  getMessages,
  listenForCurrentNewMessages,
  sendMessage,
} from "../firebase/firebaseFunctions";

export default function Chat() {
  const chatUserDetails = useSelector(
    (state) => state.reducer.sidePanel.currentChatUser
  );

  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const currentUserId = userDetails.uid;

  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const chatId =
    currentUserId > chatUserDetails.id
      ? `${currentUserId}${chatUserDetails.id}`
      : `${chatUserDetails.id}${currentUserId}`;

  const currentChat = useSelector(
    (state) => state.reducer.chat.currentChat.currentChat
  );

  // console.log(currentChat);

  useEffect(() => {
    listenForCurrentNewMessages(chatId, dispatch);
    getMessages(chatId, dispatch);
  }, []);

  function handleSend() {
    if (message.length > 0) {
      sendMessage(chatId, message, currentUserId, chatUserDetails.id, dispatch);
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
      <div style={{ flex: 1, backgroundColor: "green", overflow: "auto" }}>
        {currentChat &&
          currentChat.map((item, i) => {
            return (
              <p>
                <div>{item.message}</div>
                <div>{item.senderId}</div>
                <div>{item.timestamp}</div>
              </p>
            );
          })}
      </div>
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
