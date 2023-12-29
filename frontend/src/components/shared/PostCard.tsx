import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type PostCardProps = {
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
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post.creator) return null;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.id}`}>
            <img
              src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-dark-1">
              {post.creator.firstName} {post.creator.lastName}
            </p>
            <div className="flex-center gap-2 text-dark-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.province} at {post.municipal}
              </p>
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
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
