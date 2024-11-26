import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const StyledTextfield = ({ label, inputRef }) => {
  return (
    <TextField
      label={label}
      id="outlined-size-small"
      size="small"
      fullWidth
      inputRef={inputRef}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#323232",
          },
          "&:hover fieldset": {
            borderColor: "#323232",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#323232",
            borderWidth: "1px",
          },
          "& input": {
            color: "#323232",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#323232",
          "&.Mui-focused": {
            color: "#323232",
          },
          "&.MuiFormLabel-filled": {
            color: "#323232",
          },
        },
      }}
    />
  );
};

const StyledPasswordTextField = ({ label, inputRef }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      label={label}
      id="outlined-size-small"
      size="small"
      fullWidth
      inputRef={inputRef}
      type={showPassword ? "text" : "password"}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#323232",
          },
          "&:hover fieldset": {
            borderColor: "#323232",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#323232",
            borderWidth: "1px",
          },
          "& input": {
            color: "#323232",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#323232",
          "&.Mui-focused": {
            color: "#323232",
          },
          "&.MuiFormLabel-filled": {
            color: "#323232",
          },
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

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

const StyledButtonForRegister = ({ onClick, label }) => {
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

const TextFieldWithValue = ({ label, value, onChange }) => {
  return (
    <TextField
      label={label}
      id="outlined-size-small"
      size="small"
      fullWidth
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#323232",
          },
          "&:hover fieldset": {
            borderColor: "#323232",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#323232",
            borderWidth: "1px",
          },
          "& input": {
            color: "#323232",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#323232",
          "&.Mui-focused": {
            color: "#323232",
          },
          "&.MuiFormLabel-filled": {
            color: "#323232",
          },
        },
      }}
    />
  );
};

const StyledTextfieldForAddFriend = ({ label, inputRef, onChange }) => {
  return (
    <TextField
      label={label}
      id="outlined-size-small"
      size="small"
      fullWidth
      inputRef={inputRef}
      onChange={onChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#323232",
          },
          "&:hover fieldset": {
            borderColor: "#323232",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#323232",
            borderWidth: "1px",
          },
          "& input": {
            color: "#323232",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#323232",
          "&.Mui-focused": {
            color: "#323232",
          },
          "&.MuiFormLabel-filled": {
            color: "#323232",
          },
        },
      }}
    />
  );
};

export {
  StyledTextfield,
  StyledPasswordTextField,
  StyledButton,
  TextFieldWithValue,
  StyledTextfieldForAddFriend,
};
