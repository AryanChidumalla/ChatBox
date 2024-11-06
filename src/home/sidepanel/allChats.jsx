import { useEffect, useRef, useState } from "react";
import {
  StyledTextfield,
  StyledTextfieldForAddFriend,
} from "../../mui-templates/textfield";
import { useDispatch, useSelector } from "react-redux";
import EmptyProfileIcon from "../../assets/emptyProfileIcon.svg";
import { setCurrentChatUser } from "../../redux/reducer/sidepanel";
import {
  initializeAllChats,
  listenForNewMessages,
} from "../../firebase/firebaseFunctions";

export default function AllChats() {
  const search = useRef();
  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const friendsList = useSelector(
    (state) => state.reducer.sidePanel.friends.friendsList
  );
  const currentUserId = userDetails.uid;

  const chatList = useSelector((state) => state.reducer.chat.chatList);

  const dispatch = useDispatch();

  const [results, setResults] = useState([]);

  useEffect(() => {
    initializeAllChats(currentUserId, dispatch);
    listenForNewMessages(currentUserId, dispatch);
    // listenForNewMessages(currentUserId, dispatch);
  }, []);

  async function handleSearch() {
    const term = search.current.value;
    if (term) {
      const result = friendsList.filter(
        (friend) =>
          friend.username &&
          friend.username.toLowerCase().includes(term.toLowerCase())
      );

      setResults(result);
    } else {
      setResults([]); // Clear results if the search term is empty
    }
  }

  function handleUserClick(user) {
    const payLoad = {
      id: user.id,
      image: user.image,
      username: user.username,
      description: user.description,
      email: user.email,
    };
    // console.log(payLoad);
    dispatch(setCurrentChatUser(payLoad));
  }

  const ChatListDiv = ({ chatList }) => {
    if (!chatList || chatList.length === 0) {
      return <div>No chats available</div>; // Handle case where there are no chats
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          height: "100%",
        }}
      >
        {chatList.map((chat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#EDEDED",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleUserClick(chat)}
          >
            <div>
              {chat.image === "" ? (
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
                  src={chat.image}
                  alt="Profile"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
            <div style={{ flexGrow: 1 }}>
              <h4
                style={{
                  color: "#323232",
                  margin: "0",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {chat.username}
              </h4>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        height: "100%",
      }}
    >
      <h2
        style={{
          color: "#323232",
          margin: "0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        All Chats
      </h2>
      <StyledTextfieldForAddFriend
        label="Search"
        inputRef={search}
        onChange={handleSearch}
      />

      {search.current?.value === "" ? (
        <ChatListDiv chatList={chatList} />
      ) : (
        <>
          {search.current?.value !== "" &&
            (results.length === 0 ? (
              <div>No results found</div>
            ) : (
              results.map((user, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    backgroundColor: "#EDEDED",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <div>
                    {user.image === "" ? (
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
                        src={user.image}
                        alt="Profile"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4
                      style={{
                        color: "#323232",
                        margin: "0",
                        display: "flex",
                        justifyContent: "flex-start",
                      }}
                    >
                      {user.username}
                    </h4>
                  </div>
                </div>
              ))
            ))}
        </>
      )}
    </div>
  );
}
