import { useEffect, useState, useRef, RefObject } from "react"; // Import RefObject
import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext } from "@/context/PostContext";

const Home = () => {
  const { user, isLoading } = useUserContext();
  const { postData, isPostLoading, error, fetchPosts } = usePostContext();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPosts(10, 0);
  }, []);

  useEffect(() => {
    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPostLoading && !error) {
          setIsLoadingMore(true);
          fetchPosts(10, postData.length);
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observerInstance.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observerInstance.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, isPostLoading, error, fetchPosts, postData.length]);

  return (
    <div className="flex flex-1 bg-blue-100">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold w-full text-center">Home Feed</h2>
          <ul className="flex flex-col flex-1 gap-4 w-full">
            {postData.map((post, index) => (
              <li key={post.id} className="flex justify-center w-full">
                <PostCard post={post} userId={user.id} />
                {index === postData.length - 1 && <div ref={observerTarget}></div>}
              </li>
            ))}
          </ul>
          {isLoadingMore && <Loader />}
          {error && (
            <div className="error-container">
              <p className="body-medium text-dark-1">Error: {error}</p>
            </div>
          )}
        </div>
        {/*  */}
      </div>
      <div className="home-creators bg-red-100">
        <div className="flex gap-3 items-center mt-5 hover:cursor-pointer">
          <img
            src={
              isLoading
                ? "/assets/icons/profile-placeholder.svg"
                : user.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile picture"
            className="h-12 w-12 rounded-full bg-cover"
          />
          <div
            className="flex flex-col"
            onClick={() => {
              window.location.href = `/profile/${user.id}`;
            }}
          >
            {isLoading || !user.id ? (
              <p>Loading...</p>
            ) : (
              <>
                <p className="font-bold text-regular">
                  {user.firstName} {user.lastName}
                </p>
                <p className="small-regular text-light-3">@{user.username}</p>
              </>
            )}
          </div>
        </div>
        <h3 className="font-bold text-base">People you may know</h3>
        <Loader />
      </div>
    </div>
  );
};

export default Home;
