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
import { setSidePanelInbox } from "../redux/reducer/sidepanel";

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
    senderId,
    status: "pending",
    timestamp: new Date(),
  };

  try {
    // Create a reference to the receiver's friendRequests sub-collection
    const receiverRef = doc(db, "users", receiverId); // Reference to the receiver's user document
    const friendRequestsRef = collection(receiverRef, "friendRequests"); // Reference to the friendRequests sub-collection

    // Add the friend request data to the receiver's sub-collection
    await addDoc(friendRequestsRef, friendRequestData);
    console.log("Friend request sent successfully!");
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
  const requestsRef = collection(userRef, "friendRequests");

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

// Function to accept a friend request
const acceptFriendRequest = async (requestId) => {
  try {
    // Get the friend request document
    const requestDocRef = doc(db, "friendRequests", requestId);

    // Fetch the request data
    const requestSnapshot = await getDoc(requestDocRef);
    const requestData = requestSnapshot.data();

    if (requestData) {
      // Add the users to each other's friends collection (or however you manage friendships)
      await setDoc(
        doc(db, "friends", requestData.senderId),
        {
          [requestData.receiverId]: true, // Add receiverId as a friend for senderId
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "friends", requestData.receiverId),
        {
          [requestData.senderId]: true, // Add senderId as a friend for receiverId
        },
        { merge: true }
      );

      // Delete the friend request after accepting
      await deleteDoc(requestDocRef);
    }
  } catch (error) {
    console.error("Error accepting friend request: ", error.message);
    throw new Error(error.message); // Handle errors appropriately
  }
};

// Function to decline a friend request
const declineFriendRequest = async (requestId) => {
  try {
    // Delete the friend request document
    await deleteDoc(doc(db, "friendRequests", requestId));
  } catch (error) {
    console.error("Error declining friend request: ", error.message);
    throw new Error(error.message); // Handle errors appropriately
  }
};

// const listenForFriendRequests = (receiverId) => {
//   const dispatch = useDispatch(); // Initialize dispatch

//   const friendRequestsRef = collection(
//     doc(db, "users", receiverId),
//     "friendRequests"
//   );

//   onSnapshot(friendRequestsRef, (snapshot) => {
//     const inboxList = [];
//     snapshot.docChanges().forEach((change) => {
//       if (change.type === "added") {
//         const request = change.doc.data();
//         console.log("New Friend Added:", request);
//         inboxList.push(request); // Collect all requests
//       }
//     });

//     // Prepare the payload for the Redux action
//     const payload = {
//       inboxList: inboxList,
//       inboxNotification: inboxList.length, // Update the notification count
//     };

//     console.log("Payload:", payload);

//     // Dispatch action to update the Redux state
//     dispatch(setSidePanelInbox(payload));
//   });
// };

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

const initializeInbox = async (receiverId) => {
  const friendRequestsRef = collection(
    doc(db, "users", receiverId),
    "friendRequests"
  );

  try {
    const querySnapshot = await getDocs(friendRequestsRef);
    const friendRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return friendRequests;
  } catch (error) {
    console.log("Error fetching freind data: ", error);
  }
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
  // listenForFriendRequests,
  getFriendsList,
  initializeInbox,
};
