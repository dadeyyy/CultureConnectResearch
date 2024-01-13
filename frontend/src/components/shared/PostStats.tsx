import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PostStatsProps {
  post: {
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
  };
  userId: number;
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // Check if the post is liked by the user and get like count
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${post.id}/like-status`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Error checking like status. Server responded with:", response);
          return;
        }

        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.count);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [post.id, userId]);

  const handleLikePost = async () => {
    try {
      const response = await fetch(`http://localhost:8000/post/${post.id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error liking post. Server responded with:", response);
        return;
      } else console.log("Liked Successfully");

      const data = await response.json();
      setLikeCount(data.count);
      console.log("like count", data.count);
      setIsLiked((prevIsLiked) => !prevIsLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";

  return (
    <div className={`flex justify-between items-center my-5 z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likeCount}</p>
      </div>
    </div>
  );
};

export default PostStats;
