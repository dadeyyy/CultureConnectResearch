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
};

interface IPostContext {
  postData: IPost[];
  isPostLoading: boolean;
  error: string;
  fetchPosts: (limit: number, offset: number) => void;
}

const PostContext = createContext<IPostContext | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [postData, setPostData] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async (limit: number, offset: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/post?limit=${limit}&offset=${offset}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setPostData((prevData) => [...prevData, ...data]);
      setIsPostLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Something went wrong while fetching posts. Please try again later.");
      setIsPostLoading(false);
      throw error;
    }
  };

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
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
