import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${post.id}/comments`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data) {
          setCommentCount(data.comments.length);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, [post.id]);

  useEffect(() => {
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
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    try {
      const response = await fetch(`http://localhost:8000/post/${post.id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error liking post. Server responded with:", response);
        return;
      }

      const data = await response.json();
      setLikeCount(data.count);
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
      <a
        onClick={() => {
          navigate(`/posts/${post.id}`);
        }}
        className={`hover:cursor-pointer focus:outline-none  ${showComments ? "hidden" : ""}`}
      >
        <div className="flex flex-row gap-1">
          <img
            src={"/assets/icons/comment.svg"}
            alt="comment"
            width={25}
            height={25}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{commentCount}</p>
        </div>
      </a>
      <div className="flex flex-row gap-1 items-center cursor-pointer">
        <img
          src={"/assets/icons/share.svg"}
          alt="comment"
          width={25}
          height={25}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium text-center">Share</p>
      </div>
    </div>
  );
};

export default PostStats;
