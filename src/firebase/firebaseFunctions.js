import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useDispatch } from "react-redux";
import { setFriendsList, setSidePanelInbox } from "../redux/reducer/sidepanel";

const registerUser = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      username: username,
      email: email,
      description: "",
      image: "",
    });

    return res.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const loginUser = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserDetails = async (uid) => {
  try {
    const userDoc = doc(db, "users", uid); // Reference to the user document
    const docSnap = await getDoc(userDoc); // Fetch the document

    if (docSnap.exists()) {
      return docSnap.data(); // Return the user data
    } else {
      throw new Error("No such user exists!"); // Handle case where user does not exist
    }
  } catch (error) {
    throw new Error(error.message); // Handle errors
  }
};

const updateUserDetails = async (uid, username, description, image) => {
  try {
    const userDocRef = doc(db, "users", uid); // Reference to the user document
    const storage = getStorage(); // Get Firebase Storage reference
    const imageRef = ref(storage, `${uid}/profile.jpg`); // Reference to the user's profile image

    // Prepare the update object
    const updateData = {
      username: username,
      description: description,
    };

    if (image) {
      try {
        // Try to get the URL for the existing image
        await getDownloadURL(imageRef); // This will throw an error if the image does not exist

        // If the image exists, update the existing profile image
        await uploadBytes(imageRef, image); // Upload the new image file
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          // The image doesn't exist; upload it
          await uploadBytes(imageRef, image); // Upload the image file
        } else {
          // Handle other potential errors (e.g., permission issues)
          throw new Error("Error checking image existence: " + error.message);
        }
      }

      // Get the download URL for the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      updateData.image = imageUrl; // Add image URL to the update object
    }

    // Perform the update in Firestore
    await updateDoc(userDocRef, updateData);
  } catch (error) {
    throw new Error(error.message); // Handle errors
  }
};

// Assume this is your existing searchUsers function
const searchUsers = async (searchTerm) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("username", ">=", searchTerm),
    where("username", "<=", searchTerm + "\uf8ff")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const sendFriendRequest = async (senderId, receiverId) => {
  const friendRequestData = {
    senderId: senderId,
    receiverId: receiverId,
    status: "pending",
    timestamp: new Date(),
  };

  try {
    // Create a reference to the receiver's friendRequests sub-collection
    const receiverRef = doc(db, "users", receiverId); // Reference to the receiver's user document
    const friendRequestsRef = collection(receiverRef, "receivedFriendRequests"); // Reference to the friendRequests sub-collection

    // Add the friend request data to the receiver's sub-collection
    // await addDoc(friendRequestsRef, friendRequestData);
    await setDoc(doc(friendRequestsRef, senderId), friendRequestData);

    // Create a reference to the sender's sentFriendRequests sub-collection
    const senderRef = doc(db, "users", senderId); // Reference to the sender's user document
    const sentFriendRequestsRef = collection(senderRef, "sentFriendRequests"); // Reference to the sentFriendRequests sub-collection

    // Add the friend request data to the sender's sub-collection
    // await addDoc(sentFriendRequestsRef, friendRequestData);
    await setDoc(doc(sentFriendRequestsRef, receiverId), friendRequestData);
  } catch (error) {
    console.error("Error sending friend request: ", error);
  }
};

const getIncomingRequests = (userId, callback) => {
  // Ensure that the callback is a function
  if (typeof callback !== "function") {
    throw new TypeError("The second argument must be a function");
  }

  // Create a reference to the user's friendRequests sub-collection
  const userRef = doc(db, "users", userId);
  const requestsRef = collection(userRef, "receivedFriendRequests");

  // Create a query to get all requests where the status is "pending"
  const q = query(requestsRef, where("status", "==", "pending"));

  // Listen for real-time updates
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const incomingRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Call the callback with the updated incoming requests
      callback(incomingRequests);
    },
    (error) => {
      console.error("Error fetching incoming requests: ", error);
    }
  );

  // Return the unsubscribe function to stop listening when needed
  return unsubscribe;
};

const getFriendsList = async (userId) => {
  // Reference to the document for the current user
  const friendsDocRef = doc(db, "friends", userId);

  try {
    // Fetch the document
    const docSnapshot = await getDoc(friendsDocRef);

    // Check if the document exists
    if (docSnapshot.exists()) {
      // Extract data from the document
      const friendData = docSnapshot.data();
      // console.log("Friend Data:", friendData);

      // Return the friend data directly
      return friendData; // This should be in the format of { friendId: true }
    } else {
      console.log("No such document!");
      return {}; // Return an empty object if no document exists
    }
  } catch (error) {
    console.error("Error fetching friend data:", error);
    return {}; // Return an empty object on error
  }
};

// This is a function which fetches for friend requests from the database and sets redux state
const fetchFriendRequests = async (userId, dispatch) => {
  const friendRequestsRef = collection(
    doc(db, "users", userId),
    "receivedFriendRequests"
  );

  try {
    const querySnapshot = await getDocs(friendRequestsRef);
    const friendRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const inboxPayload = {
      inboxList: friendRequests.map((item) => ({
        ...item,
        timestamp: item.timestamp.toDate().toISOString(),
      })),
      inboxNotification: friendRequests.length,
    };

    dispatch(setSidePanelInbox(inboxPayload));
  } catch (error) {
    console.log("Error fetching freind data: ", error);
  }
};

// This function actively listens for friend requests and then if there is a change it calls the fetchFriendRequests function
const listenForFriendRequests = (userId, dispatch) => {
  const friendRequestsRef = collection(
    doc(db, "users", userId),
    "receivedFriendRequests"
  );

  onSnapshot(friendRequestsRef, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        fetchFriendRequests(userId, dispatch);
      }
    });
  });
};

// Function to accept a friend request
const acceptFriendRequest = async (
  currentUserId,
  senderId,
  requestId,
  dispatch
) => {
  try {
    // Reference to the current user's document (receiver)
    const receiverDocRef = doc(db, "users", currentUserId);
    // Reference to the sender's document
    const senderDocRef = doc(db, "users", senderId);

    // Reference to the receivedFriendRequests sub-collection for the receiver
    const receivedFriendRequestsRef = collection(
      receiverDocRef,
      "receivedFriendRequests"
    );
    // Reference to the sentFriendRequests sub-collection for the sender
    const sentFriendRequestsRef = collection(
      senderDocRef,
      "sentFriendRequests"
    );

    // Fetch the specific friend request for the receiver
    const friendRequestsSnapshot = await getDocs(receivedFriendRequestsRef);
    let foundRequest = null;
    friendRequestsSnapshot.forEach((doc) => {
      if (doc.id === senderId) {
        foundRequest = doc.data();
      }
    });

    // Fetch the specific sent request for the sender
    const sentRequestSnapshot = await getDocs(sentFriendRequestsRef);
    let foundSentRequest = null;
    sentRequestSnapshot.forEach((doc) => {
      if (doc.id === currentUserId) {
        foundSentRequest = doc.data();
      }
    });

    if (foundRequest) {
      // Delete the friend request from the receiver's receivedFriendRequests
      await deleteDoc(doc(receivedFriendRequestsRef, senderId));

      // Add to receiver's friends sub-collection
      const receiverFriendsRef = collection(receiverDocRef, "friends");
      await setDoc(doc(receiverFriendsRef, senderId), {
        id: foundRequest.senderId,
        status: "friends",
        timestamp: new Date(),
      });
    } else {
      console.log("Error");
    }

    if (foundSentRequest) {
      // Delete the sent friend request from the sender's sentFriendRequests
      await deleteDoc(doc(sentFriendRequestsRef, currentUserId));

      // Add to sender's friends sub-collection
      const senderFriendsRef = collection(senderDocRef, "friends");
      await setDoc(doc(senderFriendsRef, currentUserId), {
        id: foundSentRequest.receiverId,
        status: "friends",
        timestamp: new Date(),
      });
    } else {
      console.log("Error");
    }

    fetchFriendRequests(currentUserId, dispatch);
  } catch (error) {
    console.error("Error accepting friend request: ", error.message);
  }
};

// Function to decline a friend request
const declineFriendRequest = async (
  currentUserId,
  senderId,
  requestId,
  dispatch
) => {
  try {
    // Reference to the current user's document (receiver)
    const receiverDocRef = doc(db, "users", currentUserId);
    // Reference to the sender's document
    const senderDocRef = doc(db, "users", senderId);

    // Reference to the receivedFriendRequests sub-collection for the receiver
    const receivedFriendRequestsRef = collection(
      receiverDocRef,
      "receivedFriendRequests"
    );
    // Reference to the sentFriendRequests sub-collection for the sender
    const sentFriendRequestsRef = collection(
      senderDocRef,
      "sentFriendRequests"
    );

    // Fetch the specific friend request for the receiver
    const friendRequestsSnapshot = await getDocs(receivedFriendRequestsRef);
    let foundRequest = null;
    friendRequestsSnapshot.forEach((doc) => {
      if (doc.id === senderId) {
        foundRequest = doc.data();
      }
    });

    // Fetch the specific sent request for the sender
    const sentRequestSnapshot = await getDocs(sentFriendRequestsRef);
    let foundSentRequest = null;
    sentRequestSnapshot.forEach((doc) => {
      if (doc.id === currentUserId) {
        foundSentRequest = doc.data();
      }
    });

    if (foundRequest) {
      // Delete the friend request from the receiver's receivedFriendRequests
      await deleteDoc(doc(receivedFriendRequestsRef, senderId));
    } else {
      console.log("Error");
    }

    if (foundSentRequest) {
      // Delete the sent friend request from the sender's sentFriendRequests
      await deleteDoc(doc(sentFriendRequestsRef, currentUserId));
    } else {
      console.log("Error");
    }

    fetchFriendRequests(currentUserId, dispatch);
  } catch (error) {
    console.error("Error accepting friend request: ", error.message);
  }
};

const searchFriend = async (currentUserId, searchTerm) => {
  try {
    // Reference to the current user's document (receiver)
    const userDocRef = doc(db, "users", currentUserId);

    // Reference to the friends sub-collection for the receiver
    const userFriendsRef = collection(userDocRef, "friends");

    // Get all documents in the friends sub-collection
    const querySnapshot = await getDocs(userFriendsRef);

    // Map through the documents and get the data
    const friendsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter the friends list based on the search term
    const filteredFriends = friendsList.filter(
      (friend) => console.log(friend.id)
      // friend.username &&
      // friend.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log(filteredFriends);
    // return filteredFriends; // Return the filtered friends
  } catch (error) {
    console.error("Error searching for friends: ", error);
    return []; // Return an empty array on error
  }
};

// This is a function which fetches for friend requests from the database and sets redux state
const fetchFriends = async (userId, dispatch) => {
  const friendsRef = collection(doc(db, "users", userId), "friends");

  try {
    const querySnapshot = await getDocs(friendsRef);
    const friendsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch user details for each friend
    const friendsWithDetails = await Promise.all(
      friendsList.map(async (friend) => {
        const userDetails = await getUserDetails(friend.id);
        return {
          ...friend,
          ...userDetails, // Merge friend data with user details
          timestamp: friend.timestamp
            ? friend.timestamp.toDate().toISOString()
            : null, // Handle timestamp
        };
      })
    );

    const inboxPayload = {
      friendsList: friendsWithDetails,
    };

    // console.log(inboxPayload);

    // Dispatch to Redux store
    dispatch(setFriendsList(inboxPayload));
  } catch (error) {
    console.log("Error fetching friends: ", error);
  }
};

const listenForNewFriends = (userId, dispatch) => {
  const friendRequestsRef = collection(doc(db, "users", userId), "friends");

  onSnapshot(friendRequestsRef, (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        fetchFriends(userId, dispatch);
      }
    });
  });
};

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  searchUsers,
  sendFriendRequest,
  getIncomingRequests,
  acceptFriendRequest,
  declineFriendRequest,
  fetchFriendRequests,
  listenForFriendRequests,
  getFriendsList,
  searchFriend,
  // initializeInbox,
  fetchFriends,
  listenForNewFriends,
};
