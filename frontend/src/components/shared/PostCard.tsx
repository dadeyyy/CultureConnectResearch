import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import Carousel from "./Carousel";
import { filterInappropriateWords } from "@/lib/CaptionFilter";
import Comments from "./Comments";

import { municipalities, provincesTest } from "@/lib/provinces";
import ReportForm from "../forms/ReportForm";
import { Badge } from "../ui/badge";

interface PostCardProps {
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
      province?: string;
    };
  };
  userId: number;
}
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  if (!post.user) return null;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user.id}`}>
            <img
              src={post?.user.avatarUrl || "/assets/icons/profile-placeholder.svg"}
              alt="user"
              className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <div className="flex flex-row text-center gap-2">
              <p className="base-medium lg:body-bold text-dark-1">
                {post.user.firstName} {post.user.lastName}
              </p>
              {post?.user.role === `ADMIN` && (
                <Badge className="bg-green-300 font-light text-xs border border-gray-300">
                  {post?.user?.province}
                </Badge>
              )}
            </div>
            <div className="flex gap-2 text-dark-3">
              <p className="subtle-regular lg:text-xs">{multiFormatDateString(post.createdAt)}</p>
              <p className="subtle-regular lg:text-xs">
                {"In "}
                {post?.municipality &&
                  municipalities[post.province]?.find(
                    (municipal) => municipal.value === post.municipality
                  )?.label}
                {", "}
                {post?.province &&
                  provincesTest.find((province) => province.value === post.province)?.label}
              </p>
            </div>
          </div>
        </div>
        <ReportForm userId={user.id} postId={post.id} postUserId={post.user.id} />
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{filterInappropriateWords(post.caption)}</p>
        </div>
      </Link>
      <Carousel photos={post?.photos || []} />

      <PostStats post={post} userId={user.id} />
      <Comments postId={post.id} action="home" />
    </div>
  );
};

export default PostCard;
