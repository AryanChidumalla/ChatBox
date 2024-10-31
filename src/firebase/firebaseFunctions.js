import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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
    receiverId,
    status: "pending",
    timestamp: new Date(),
  };

  try {
    await addDoc(collection(db, "friendRequests"), friendRequestData);
    console.log("Friend request sent successfully!");
  } catch (error) {
    console.error("Error sending friend request: ", error);
  }
};

const getIncomingRequests = async (userId) => {
  try {
    // Reference the friendRequests collection
    const requestsRef = collection(db, "friendRequests");

    // Create a query to get all requests where the toUser is the current user
    const q = query(
      requestsRef,
      where("receiverId", "==", userId),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);

    const incomingRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id, // The document ID
      ...doc.data(), // The document data
    }));

    return incomingRequests; // Return the array of incoming requests
  } catch (error) {
    console.error("Error fetching incoming requests: ", error);
    throw new Error(error.message);
  }
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
};
