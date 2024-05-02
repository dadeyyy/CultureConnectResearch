import { useNavigate } from 'react-router-dom';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IUser } from '@/type/index';

export const INITIAL_USER = {
  id: 0,
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
  role: '',
  province: '',
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
  // const USER_STORAGE_KEY = "currentUser";
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cooki = localStorage.getItem('currentUserId');

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/user/${cooki}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieFallback = localStorage.getItem('currentUserId');
    const withoutAuthRoute = ['/signup', '/', '/confirm-email'];
    const isSignInRoute = withoutAuthRoute.includes(window.location.pathname);
    if (isSignInRoute) {
      return;
    } else if (
      cookieFallback === '[]' ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate('/signin');
    }
    else{
      checkAuthUser();
    }

  }, [cooki]);

  // useEffect(() => {
  //   checkAuthUser();
  // }, [navigate, setUser, setIsAuthenticated, setIsLoading]);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => useContext(AuthContext);
