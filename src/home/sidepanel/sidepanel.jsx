import { useEffect, useRef, useState } from "react";
import {
  acceptFriendRequest,
  getIncomingRequests,
  getUserDetails,
  logoutUser,
  searchUsers,
  sendFriendRequest,
  updateUserDetails,
} from "../../firebase/firebaseFunctions";
import {
  StyledTextfield,
  StyledTextfieldForAddFriend,
  TextFieldWithValue,
} from "../../mui-templates/textfield";
import { useSelector } from "react-redux";
import EmptyProfileIcon from "../../assets/emptyProfileIcon.svg";
import { StyledButton } from "../../mui-templates/button";
import Inbox from "./inbox";
import AddFriend from "./addFriend";
import AllChats from "./allChats";

function SidePanel({ SidePanelName }) {
  switch (SidePanelName) {
    case "All Chats":
      // return <div>All Chats</div>;
      return <AllChats />;
    case "Personal Chats":
      return <div>Personal Chats</div>;
    case "Group Chats":
      return <div>Group Chats</div>;
    case "Inbox":
      return <Inbox />;
    case "Add Friend":
      return <AddFriend />;
    case "My Profile":
      return <Profile />;
    case "Settings":
      return <Settings />;
    default:
      return null;
  }
}

function Profile() {
  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const [username, setUsername] = useState(userDetails.username);
  const [description, setDescription] = useState(userDetails.description);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Update image preview when image is selected
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setImagePreview(null);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2
        style={{
          color: "#323232",
          margin: "0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Profile
      </h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {imagePreview || userDetails.image ? (
          <img
            src={imagePreview || userDetails.image}
            alt="Profile"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src={EmptyProfileIcon}
            alt="Empty Profile Icon"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginTop: "10px" }}
      />
      <TextFieldWithValue
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextFieldWithValue
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {userDetails.username === username &&
      userDetails.description === description &&
      image === null ? null : (
        <StyledButton
          label="Update"
          onClick={() =>
            updateUserDetails(userDetails.uid, username, description, image)
          }
        />
      )}
    </div>
  );
}

function Settings() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h2
        style={{
          color: "#323232",
          margin: "0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        Settings
      </h2>
      <StyledButton
        label="Log Out"
        onClick={() => {
          logoutUser();
        }}
      />
    </div>
  );
}

export default SidePanel;
