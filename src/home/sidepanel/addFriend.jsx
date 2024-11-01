import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  searchUsers,
  sendFriendRequest,
  getFriendsList,
} from "../../firebase/firebaseFunctions";
import {
  StyledButton,
  StyledTextfieldForAddFriend,
} from "../../mui-templates/textfield";

export default function AddFriend() {
  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const currentUserId = userDetails.uid;
  const search = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [friendsList, setFriendsList] = useState({}); // Change to an object to match the return type

  // Fetch friends list on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      const friends = await getFriendsList(currentUserId);
      console.log(friends);
      setFriendsList(friends); // Save the friends list as an object
    };
    fetchFriends();
  }, [currentUserId]);

  const handleSearch = async () => {
    const term = search.current.value;
    if (term) {
      const results = await searchUsers(term);
      // Filter out the current user and check if they are friends
      const filteredResults = results
        .filter((user) => user.id !== currentUserId)
        .map((user) => ({
          ...user,
          isFriend: friendsList[user.id] === true, // Check if the user is a friend using the object
        }));
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendRequest = async (receiverId) => {
    await sendFriendRequest(currentUserId, receiverId);
    alert("Friend request sent!");
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: "20px",
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
        Add Friend
      </h2>
      <StyledTextfieldForAddFriend
        label="Search"
        inputRef={search}
        onChange={handleSearch}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
          overflowY: "auto",
          maxHeight: "400px",
        }}
      >
        {searchResults.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#EDEDED",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <div>
              <img
                src={user.image}
                alt="Profile"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
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
                {/* {user.isFriend && (
                  <span style={{ color: "green", marginLeft: "10px" }}>
                    (Already a friend)
                  </span>
                )} */}
              </h4>
              {!user.isFriend ? (
                <StyledButton
                  label="Send Request"
                  onClick={() => {
                    handleSendRequest(user.id);
                  }}
                />
              ) : (
                <StyledButton
                  label="Already a Friend"
                  disabled
                  style={{ backgroundColor: "#E0E0E0" }} // Change style for disabled button
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
