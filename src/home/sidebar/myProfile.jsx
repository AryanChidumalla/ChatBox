import React from 'react'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { getAuth, signOut } from "firebase/auth";

function MyProfile() {

  function handleLogOut() {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        // Sign-out successful
        console.log("User signed out successfully!");

        // Handle successful sign-out logic (e.g., redirect to login page)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Sign out error:", errorCode, errorMessage);

        // Handle sign-out errors (e.g., display error message)
      });
  }


  return (
    <div className='MyProfileContainer'>
        <div className='MyProfileSubContainer'>
            <AccountCircleOutlinedIcon/>
            <div>My Profile</div>
        </div>
        <button onClick={handleLogOut}>
            <LogoutOutlinedIcon/>
        </button>
    </div>
  )
}

export default MyProfile