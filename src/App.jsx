import { useEffect, useState } from "react";
import Register from "./register";
import Home from "./home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserDetails } from "./redux/reducer/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import {
  fetchFriendRequests,
  fetchFriends,
  getUserDetails,
  listenForFriendRequests,
  listenForNewFriends,
} from "./firebase/firebaseFunctions";
import { LoadingScreen } from "./loading/loadingScreen";

function App() {
  const dispatch = useDispatch(); // To dispatch actions to Redux store
  const [loading, setLoading] = useState(true); // State to manage loading status

  const user = useSelector((state) => state.reducer.auth.user); // Select current user from Redux store
  const userDetail = useSelector((state) => state.reducer.auth.userDetails); // Select user details from Redux store

  // Effect hook runs when the component mounts and listens for Firebase authentication state changes
  useEffect(() => {
    // Subscribing to Firebase auth state changes
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true); // Set loading state to true before starting the authentication process

      if (user) {
        // If user is authenticated, fetch necessary data
        await fetchFriendRequests(user.uid, dispatch); // Fetch friend requests for the authenticated user
        await listenForFriendRequests(user.uid, dispatch); // Listen for any changes in friend requests
        await fetchFriends(user.uid, dispatch); // Fetch the user's friends
        await listenForNewFriends(user.uid, dispatch); // Listen for any new friends added

        // Create a serializable user object for Redux
        const serializableUser = {
          uid: user.uid,
          email: user.email,
        };

        try {
          // Fetch the user's detailed information from Firebase
          const userDetails = await getUserDetails(user.uid);
          dispatch(setUser(serializableUser)); // Dispatch user data to Redux store
          dispatch(setUserDetails(userDetails)); // Dispatch user details to Redux store
        } catch (error) {
          console.error("Error fetching user details:", error); // Handle errors when fetching user details
        }
      } else {
        // If no user is logged in, set the user state in Redux to null
        dispatch(setUser(null));
      }

      setLoading(false); // Set loading state to false after user data is fetched
    });

    // Cleanup function to unsubscribe from the auth state listener when the component unmounts
    return () => {
      unsub();
    };
  }, [dispatch]); // Dependency array is empty, so this effect runs only once on mount

  if (loading) {
    // If the app is still loading, show a loading message or spinner
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the home page, accessible only if the user is logged in */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/register" />}
        />
        {/* Route for the register page, accessible only if the user is not logged in */}
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
