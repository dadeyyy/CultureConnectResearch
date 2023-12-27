import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

type PostStatsProps = {
  post: {
    creator: {
      id: number;
      name: string;
      imageUrl?: string;
    };
    $id: string;
    $createdAt: string;
    location: string;
    caption: string;
    tags: string[];
    imageUrl?: string;
  };
  userId: number;
};

const PostStats = ({}: PostStatsProps) => {
  const location = useLocation();

  const [likes, setLike] = useState("/assets/icons/like.svg");
  const [isSaved, setIsSaved] = useState(false);

  const handleLikePost = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setLike("/assets/icons/liked.svg");
  };

  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";

  return (
    <div className={`flex justify-between items-center z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={likes}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => handleLikePost(e)}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
    </div>
  );
};

export default PostStats;
