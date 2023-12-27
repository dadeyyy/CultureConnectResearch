import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
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
};

const PostCard = ({ post }: PostCardProps) => {
  function formatDateString(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };

    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", options);

    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return `${formattedDate} at ${time}`;
  }

  const multiFormatDateString = (timestamp: string = ""): string => {
    const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
    const date: Date = new Date(timestampNum * 1000);
    const now: Date = new Date();

    const diff: number = now.getTime() - date.getTime();
    const diffInSeconds: number = diff / 1000;
    const diffInMinutes: number = diffInSeconds / 60;
    const diffInHours: number = diffInMinutes / 60;
    const diffInDays: number = diffInHours / 24;

    switch (true) {
      case Math.floor(diffInDays) >= 30:
        return formatDateString(timestamp);
      case Math.floor(diffInDays) === 1:
        return `${Math.floor(diffInDays)} day ago`;
      case Math.floor(diffInDays) > 1 && diffInDays < 30:
        return `${Math.floor(diffInDays)} days ago`;
      case Math.floor(diffInHours) >= 1:
        return `${Math.floor(diffInHours)} hours ago`;
      case Math.floor(diffInMinutes) >= 1:
        return `${Math.floor(diffInMinutes)} minutes ago`;
      default:
        return "Just now";
    }
  };

  if (!post.creator) return null; // Return null or some default component when creator is not available

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.id}`}>
            <img
              src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •<p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post.$id}`}
          className={post.creator.id !== post.creator.id ? "hidden" : ""}
        >
          <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
        </Link>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={post.creator.id} />
    </div>
  );
};

export default PostCard;
