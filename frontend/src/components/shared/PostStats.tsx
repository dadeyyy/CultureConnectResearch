import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type PostStatsProps = {
  post: {
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      imageUrl?: string;
    };
    $id: string;
    $createdAt: string;
    province: string;
    municipal: string;
    caption: string;

    imageUrl?: string;
  };
  userId: string;
};

const PostStats = ({}: PostStatsProps) => {
  const location = useLocation();

  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(22);

  const handleLikePost = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setLike((prevLike) => (isLiked ? prevLike - 1 : prevLike + 1));
  };

  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{like}</p>
      </div>
    </div>
  );
};

export default PostStats;
