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

  // const currentChat = useSelector(
  //   (state) => state.reducer.chat.currentChat.currentChat
  // );

  const [currentChat, setCurrentChat] = useState([]);

  const chatList = useSelector((state) => state.reducer.chat.chatList);

  useEffect(() => {
    // Find the chat messages for the selected user
    const currentChatMessages = chatList.find(
      (chatDetails) => chatUserDetails.id === chatDetails.id
    );

    // If a chat is found for the user, update the currentChat state
    if (currentChatMessages) {
      setCurrentChat(currentChatMessages.messages);
    }
  }, [chatList, chatUserDetails.id]); // Re-run the effect when chatList or chatUserDetails changes

  useEffect(() => {
    listenForCurrentNewMessages(chatId, dispatch);
    getMessages(chatId, dispatch);
    // listenForNewMessages(currentUserId, dispatch);
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
      <div
        style={{
          flex: 1,
          backgroundColor: "#FDFDFD",
          overflow: "auto",
          padding: "20px",
        }}
      >
        {currentChat &&
          currentChat.map((item, i) => {
            return (
              <p>
                {item.senderId === currentUserId ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "fit-content",
                        maxWidth: "60%",
                        backgroundColor: "#FFDE95",
                        padding: "10px",
                        borderRadius: "10px 10px 0px 10px",
                      }}
                    >
                      {item.message}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: "fit-content",
                        maxWidth: "60%",
                        backgroundColor: "#EDEDED",
                        padding: "10px",
                        borderRadius: "10px 10px 10px 0px",
                      }}
                    >
                      {item.message}
                    </div>
                  </div>
                )}
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
