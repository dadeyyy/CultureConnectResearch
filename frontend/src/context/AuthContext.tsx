import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";

import { IUser } from "@/type/index";

//This is a dummy user, get the current user from the backend
const dummyUser: IUser = {
  id: "1",
  firstName: "Boss",
  lastName: "Amo",
  username: "boss.amo999",
  email: "boss@example.com",
  imageUrl:
    "https://th.bing.com/th/id/OIP.FKf7M863jluP9y3oejEgpgHaHd?w=512&h=516&rs=1&pid=ImgDetMain",
  bio: "This is a test bio.",
};

async function getCurrentUser() {
  return dummyUser;
}

export const INITIAL_USER: IUser = {
  id: "",
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
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.id,
          firstName: currentAccount.firstName,
          lastName: currentAccount.lastName,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });
        setIsAuthenticated(true);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const cookieFallback = localStorage.getItem("cookieFallback");
  //   if (cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined) {
  //     navigate("/signin");
  //   }

  //   checkAuthUser();
  // }, [navigate]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
