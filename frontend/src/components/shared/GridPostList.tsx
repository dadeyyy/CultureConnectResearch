import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      avatarUrl: string;
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

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img src={post.photos[0].url} alt="post" className="h-full w-full object-cover" />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <Avatar>
                  <AvatarImage src={post.user.avatarUrl} alt={`profile-pictre`} />
                  <AvatarFallback>
                    {getInitials(post.user.firstName, post.user.lastName)}
                  </AvatarFallback>
                </Avatar>
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
