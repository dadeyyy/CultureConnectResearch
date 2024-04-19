import { Link } from "react-router-dom";

import PostStats from "@/components/shared/PostStats";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: {
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
    reportCount: number;
    updatedAt: string;
    user: {
      avatarUrl: string | null;
      firstName: string;
      id: number;
      lastName: string;
      role: string;
      username: string;
      province?: string;
    };
    userId: number;
    tags: string[];
  }[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.photos[0].url}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post.user.avatarUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1 capitalize">
                  {post.user.firstName} {post.user.lastName}
                </p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
