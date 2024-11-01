import { useContext, useEffect } from "react";
import Register from "./register";
import Home from "./home";
import { AuthContext } from "./context/context";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserDetails } from "./redux/reducer/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import {
  getUserDetails,
  listenForFriendRequests,
} from "./firebase/firebaseFunctions";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.reducer.auth.user);
  const userDetail = useSelector((state) => state.reducer.auth.userDetails);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        listenForFriendRequests(user.uid);
        const serializableUser = {
          uid: user.uid,
          email: user.email,
        };

        try {
          const userDetails = await getUserDetails(user.uid);
          dispatch(setUser(serializableUser));
          dispatch(setUserDetails(userDetails));
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      unsub();
    };
  }, [dispatch]);

  // if (user === null) {
  //   return <div>Loading...</div>;
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/register" />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
