import React, { createContext, useState, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
      setUsername(username);
      localStorage.setItem("username", username);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/task_list")
    } else {
      setIsLoggedIn(false);
      setUsername(null);
      localStorage.removeItem("username");
      localStorage.setItem("isLoggedIn", "false");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: isLoggedIn, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
