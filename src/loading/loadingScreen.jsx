import React from "react";
import LoadingAnimation from "../assets/LoadingAnimation.mp4";

export const LoadingScreen = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video autoPlay loop muted>
        <source src={LoadingAnimation} type="video/mp4" />
      </video>
    </div>
  );
};
