// Home.tsx
import { useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext } from "@/context/PostContext";

const Home = () => {
  const { user } = useUserContext();
  const { postData, isPostLoading, error, fetchPosts } = usePostContext();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading ? (
            <Loader />
          ) : error ? (
            <div className="error-container">
              <p className="body-medium text-dark-1">Error: {error}</p>
            </div>
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {postData.map((post) => (
                <li key={post.id} className="flex justify-center w-full">
                  <PostCard post={post} userId={user.id} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
