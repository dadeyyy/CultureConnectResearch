import { useNavigate } from "react-router-dom";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IUser } from "@/type/index";

export const INITIAL_USER = {
  id: 0,
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
  role: "",
  province: "",
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
  const USER_STORAGE_KEY = "currentUser";
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Change to true initially

  const checkAuthUser = useCallback(async () => {
    try {
      const cookieFallback = localStorage.getItem(USER_STORAGE_KEY);

      if (
        !cookieFallback ||
        cookieFallback === "[]" ||
        cookieFallback === null ||
        cookieFallback === undefined
      ) {
        navigate("/signin");
        return false;
      }

      const storedUser = JSON.parse(cookieFallback);

      if (storedUser) {
        setUser({
          id: storedUser.id,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          username: storedUser.username,
          email: storedUser.email,
          imageUrl: storedUser.imageUrl,
          bio: storedUser.bio,
          role: storedUser.role,
          province: storedUser.province,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking authentication:", error);
      throw error; // Re-throw the error after logging
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setUser, setIsAuthenticated, setIsLoading]);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthUser();
      setIsLoading(false);
    };

    if (isLoading) {
      initializeAuth();
    }
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

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => useContext(AuthContext);
