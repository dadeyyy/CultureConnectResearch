import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import { getUserById } from "@/dummy/dummy";
import { DummyUser } from "@/dummy/dummy";

export const INITIAL_USER: DummyUser = {
  id: "",
  firstName: "",
  lastName: "",
  username: "",
  birthdate: "",
  email: "",
  imageUrl: "",
  bio: "",
  posts: [],
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
  user: DummyUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<DummyUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<DummyUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getUserById("999");
      if (currentAccount) {
        setUser({
          id: currentAccount.id,
          firstName: currentAccount.firstName,
          lastName: currentAccount.lastName,
          username: currentAccount.username,
          birthdate: currentAccount.birthdate,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
          posts: currentAccount.posts,
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
