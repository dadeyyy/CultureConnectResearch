import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type IPost = {
  id: number;
  caption: string;
  createdAt: string;
  municipality: string;
  photos: {
    id: number;
    url: string;
    filename: string;
    postId: number;
  }[];
  province: string;
  updatedAt: string;
  user: {
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    password: string;
    role: string;
    updatedAt: string;
    username: string;
  };
  userId: number;
  tags: string[];
};

interface IPostContext {
  postData: IPost[];
  isPostLoading: boolean;
  error: string;
  fetchPosts: () => void;
}

const PostContext = createContext<IPostContext | undefined>(undefined);

interface ForYouProviderProps {
  children: ReactNode;
}
const server ='http://localhost:8000'
export const ForYouProvider: React.FC<ForYouProviderProps> = ({ children }) => {
  const [postData, setPostData] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`${server}:8000/algorithm`, { credentials: "include" });
      const data = await response.json();
      console.log("ALGORITHM", data);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPostData(data);
      setIsPostLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Something went wrong while fetching posts. Please try again later.");
      setIsPostLoading(false);
    }
  }, []);

  const value: IPostContext = {
    postData,
    isPostLoading,
    error,
    fetchPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a ForYouProvider");
  }
  return context;
};
