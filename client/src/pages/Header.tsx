import React from "react";
import { Button, Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { logout } = useAuth();

  const storedUsername = localStorage.getItem("username") || "User";
  const userInitials = storedUsername
    .split(" ")
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 40px",
        backgroundColor: "#1976d2",
        color: "white",
        height: "30px",
      }}
    >
      <Typography variant="h6">Task Management</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            backgroundColor: "#ffffff",
            cursor: "pointer",
            color:"black"
          }}
        >
          {userInitials}
        </Avatar>
        <Typography variant="body1" sx={{ marginLeft: 2 }}>
          {storedUsername}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ marginLeft: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
