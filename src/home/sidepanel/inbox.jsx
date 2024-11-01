import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getIncomingRequests,
  getUserDetails,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../firebase/firebaseFunctions";

export default function Inbox() {
  const userDetails = useSelector((state) => state.reducer.auth.userDetails);
  const currentUserId = userDetails.uid;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = getIncomingRequests(
      currentUserId,
      async (incomingRequests) => {
        // Fetch user details for each incoming request
        const userDetailsPromises = incomingRequests.map(async (request) => {
          const userDetail = await getUserDetails(request.senderId);
          return { ...userDetail, requestId: request.id };
        });

        // Wait for all promises to resolve
        const userDetailsArray = await Promise.all(userDetailsPromises);

        // Update the requests state
        setRequests(userDetailsArray);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [currentUserId]);

  const handleAccept = async (requestId) => {
    await acceptFriendRequest(requestId);
    // Update requests state to remove the accepted request
    setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
  };

  const handleDecline = async (requestId) => {
    await declineFriendRequest(requestId);
    // Update requests state to remove the declined request
    setRequests((prev) => prev.filter((req) => req.requestId !== requestId));
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
        Inbox
      </h2>
      {requests.map((user, i) => (
        <div
          key={i}
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
          <div>
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
            <div>
              <button onClick={() => handleAccept(user.requestId)}>
                Accept
              </button>
              <button onClick={() => handleDecline(user.requestId)}>
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
