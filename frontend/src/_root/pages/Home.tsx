import React, { useEffect, useState, useRef } from "react";
import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { IPost } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/shared/PostSkeleton";

const Home = () => {
  const { user, isLoading } = useUserContext();
  const [postData, setPostData] = useState<IPost[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [load, setLoad] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedSection, setSelectedSection] = useState<"For You" | "Following">("For You");

  const fetchPosts = async (limit: number, offset: number) => {
    try {
      let endpoint = `http://localhost:8000/post?limit=${limit}&offset=${offset}`;
      if (selectedSection === "Following") {
        endpoint = `http://localhost:8000/following/posts?userId=${user.id}&limit=${limit}&offset=${offset}`;
      }
      console.log(selectedSection);
      const response = await fetch(endpoint, {
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPostData((prevData) => [...prevData, ...data]);
      setIsPostLoading(false);
      setLoad(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Something went wrong while fetching posts. Please try again later.");
      setIsPostLoading(false);
      setLoad(false);
    }
  };

  //clear if the selectedSection changezcx
  useEffect(() => {
    setPostData([]);
    setIsPostLoading(true);
    fetchPosts(3, 0);
  }, [selectedSection]);

  useEffect(() => {
    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPostLoading && !error) {
          setIsLoadingMore(true);
          fetchPosts(3, postData.length); // Fetch more posts when scrolling to the end
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
  }, [isPostLoading, error, postData.length]); // Add dependencies to useEffect

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="home-container">
        <div className="w-full flex flex-col items-center relative">
          <div className="home-header">
            <div
              className={`text-center w-full p-3 active:bg-blue-200 ${
                selectedSection === "For You" && "bg-gray-200"
              }`}
              onClick={() => {
                setSelectedSection("For You");
                setLoad(true);
              }}
            >
              For You
            </div>
            <div
              className={`text-center w-full p-3 active:bg-blue-200 ${
                selectedSection === "Following" && "bg-gray-200"
              }`}
              onClick={() => {
                setSelectedSection("Following");
                setLoad(true);
              }}
            >
              Following
            </div>
          </div>
          <div className="home-posts">
            {load ? (
              <PostSkeleton />
            ) : (
              <ul className="flex flex-col flex-1 gap-4 w-full">
                {postData.map((post, index) => (
                  <li key={post.id} className="flex justify-center w-full">
                    <PostCard post={post} userId={user.id} />
                    {index === postData.length - 1 && <div ref={observerTarget}></div>}
                  </li>
                ))}
              </ul>
            )}
            {isLoadingMore && <PostSkeleton />}
            {error && (
              <div className="error-container">
                <p className="body-medium text-dark-1">Error: {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="home-creators">
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
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-gray-400" />
            <Skeleton className="h-4 w-[200px] bg-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
