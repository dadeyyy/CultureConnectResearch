import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "@/type/index";

export const INITIAL_USER = {
  id: 0,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Change to true initially

  const checkAuthUser = async () => {
    try {
      // ------------ CHANGE THIS CURRENTUSER TO COOKIE WHEN IT IS WORKING HAHAHA -------
      const cookieFallback = localStorage.getItem("currentUser");
      if (cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined) {
        navigate("/signin");
        return false;
      }

      // Extract user information from local storage
      const storedUser = JSON.parse(localStorage.getItem("currentUser") || "null");

      if (storedUser) {
        setUser({
          id: storedUser.id,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          username: storedUser.username,
          email: storedUser.email,
          imageUrl: storedUser.imageUrl,
          bio: storedUser.bio,
        });
        setIsAuthenticated(true);
        console.log(user);
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false); // Move setIsLoading(false) to finally block
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthUser();
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
