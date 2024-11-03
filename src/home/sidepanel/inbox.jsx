import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIncomingRequests,
  getUserDetails,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../firebase/firebaseFunctions";
import EmptyProfileIcon from "../../assets/emptyProfileIcon.svg";
import { StyledButton } from "../../mui-templates/textfield";

export default function Inbox() {
  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const inboxList = useSelector(
    (state) => state.reducer.sidePanel.inbox.inboxList
  );
  const currentUserId = userDetails.uid;
  const [requests, setRequests] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userDetailsPromises = inboxList.map(async (request) => {
        const userDetail = await getUserDetails(request.senderId);
        return {
          ...userDetail,
          requestId: request.id,
          senderId: request.senderId,
        };
      });

      // Wait for all promises to resolve
      const userDetailsArray = await Promise.all(userDetailsPromises);

      // Update the requests state
      setRequests(userDetailsArray);
    };

    // Call the function to fetch user details
    fetchUserDetails();

    // Cleanup function (if necessary) can go here, but usually not needed for fetching data
    return () => {
      // Any necessary cleanup can go here
    };
  }, [currentUserId, inboxList]);

  const handleAccept = async (senderId, requestId) => {
    await acceptFriendRequest(currentUserId, senderId, requestId, dispatch);
    // Update requests state to remove the accepted request
    // setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
  };

  const handleDecline = async (senderId, requestId) => {
    await declineFriendRequest(currentUserId, senderId, requestId, dispatch);
    // Update requests state to remove the declined request
    setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        // backgroundColor: "red",
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
        Inbox
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          height: "100%",
          overflowY: "auto",
        }}
      >
        {requests.map((user, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "center",
              backgroundColor: "#EDEDED",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {user.image === "" ? (
                <img
                  src={EmptyProfileIcon}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              ) : (
                <img
                  src={user.image}
                  alt="Profile"
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
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
                {user.username}
              </h4>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <StyledButton
                  label="Accept"
                  onClick={() => handleAccept(user.senderId, user.requestId)}
                />
                <StyledButton
                  label="Decline"
                  onClick={() => handleDecline(user.senderId, user.requestId)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
