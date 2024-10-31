import { Button } from "@mui/material";

const StyledButton = ({ onClick, label }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: "#FFDE95",
        color: "#323232",
        fontWeight: "bold",
        boxShadow: "none",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#FFDE95",
          color: "#323232",
          boxShadow: "none",
        },
      }}
    >
      {label}
    </Button>
  );
};

const StyledButtonWithIcon = ({ onClick, label, icon }) => {
  return (
    <Button
      variant="contained"
      disableRipple
      onClick={onClick}
      sx={{
        backgroundColor: "transparent",
        color: "#323232",
        boxShadow: "none",
        alignItems: "center", // Center items vertically
        "&:hover": {
          backgroundColor: "#FFDE95",
          color: "#323232",
          boxShadow: "none",
        },
      }}
    >
      {icon && <img src={icon} alt="" />}
      {/* {label} */}
    </Button>
  );
};

export { StyledButton, StyledButtonWithIcon };
