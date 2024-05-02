import { Link } from "react-router-dom";
import { IPost, multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import Carousel from "./Carousel";
import { filterInappropriateWords } from "@/lib/CaptionFilter";
import Comments from "./Comments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { municipalities, provincesTest } from "@/lib/provinces";
import ReportForm from "../forms/ReportForm";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import PostStats from "./PostStats";
import Loader from "./Loader";

interface PostProps {
  id: number;
  caption: string;
  postId?: number;
  userId: number;
  createdAt: string;
  author: userProps;
  type: "shared" | "regular";
}

interface userProps {
  avatarUrl: string;
  createdAt: string;
  firstName: string;
  id: number;
  lastName: string;
  role: string;
  username: string;
  province: string;
}

const SharedPostCard = ({ id, caption, userId, createdAt, postId, author }: PostProps) => {
  const { user } = useUserContext();
  const [post, setPost] = useState<IPost>();
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [showSharedCaption, setShowSharedCaption] = useState(false);

  const truncatedSharedCaption =
    caption.length > 128 ? `${caption.slice(0, caption.lastIndexOf(" ", 156))}...` : caption;
  const toggleSharedCaption = () => {
    setShowSharedCaption(!showSharedCaption);
  };

  const truncatedCaption =
    post?.caption?.length && post.caption.length > 128
      ? `${post.caption.slice(0, post.caption.lastIndexOf(" ", 156))}...`
      : post?.caption;

  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${postId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const postData = await response.json();
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);
  if (!post?.user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="w-full">
      <div className="post-card">
        <div>
          <Link to={`/profile/${userId}`}>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={author.avatarUrl} alt={`profile-pictre`} />
                <AvatarFallback>{getInitials(author.firstName, author.lastName)}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="flex flex-row text-center gap-2">
                  <p className="base-medium lg:body-bold text-dark-1 capitalize">
                    {author.firstName} {author.lastName}
                  </p>
                  {author.role === `ADMIN` && (
                    <Badge className="bg-green-300 font-semibold text-xs border text-gray-600 capitalize border-gray-300">
                      {author.province}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2 text-dark-3">
                  <p className="subtle-regular xs:text-xs">{multiFormatDateString(createdAt)}</p>
                </div>
              </div>
            </div>
          </Link>
          <Link to={`/shared-post/${id}`}>
            <div className="small-medium lg:base-medium py-2">
              <p className="text-justify text-base font-normal">
                {showFullCaption ? (
                  filterInappropriateWords(caption)
                ) : (
                  <>
                    {filterInappropriateWords(truncatedSharedCaption)}
                    {caption.length > 156 && (
                      <>
                        <span> </span> {/* Add a space for visual separation */}
                        <span
                          onClick={toggleSharedCaption}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          See more
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </Link>
        </div>
        <div className="border-2 border-gray-300 rounded-xl p-2">
          <div className="flex-between pt-2">
            {!post && <Loader />}
            <Link to={`/profile/${post.user.id}`}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.user.avatarUrl} alt={`profile-pictre`} />
                  <AvatarFallback>
                    {getInitials(post.user.firstName, post.user.lastName)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <div className="flex flex-row text-center gap-2">
                    <p className="base-medium lg:body-bold text-dark-1 capitalize">
                      {post.user.firstName} {post.user.lastName}
                    </p>
                    {post.user.role === `ADMIN` && (
                      <Badge className="bg-green-300 font-semibold text-xs border text-gray-600 capitalize border-gray-300">
                        {post.user.province}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2 text-dark-3">
                    <p className="subtle-regular xs:text-xs">
                      {multiFormatDateString(post?.createdAt)}
                    </p>
                    <p className="subtle-regular xs:text-xs">
                      {"In "}
                      {post?.municipality &&
                        municipalities[post?.province]?.find(
                          (municipal) => municipal.value === post?.municipality
                        )?.label}
                      {", "}
                      {post?.province &&
                        provincesTest.find((province) => province.value === post?.province)?.label}
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <ReportForm userId={user.id} postId={post?.id} postUserId={post?.user.id} />
          </div>

          <Link to={`/posts/${post?.id}`}>
            <div className="small-medium lg:base-medium py-2">
              <p className="text-justify text-base font-normal">
                {showFullCaption ? (
                  filterInappropriateWords(post?.caption)
                ) : (
                  <>
                    {filterInappropriateWords(truncatedCaption || '')}
                    {caption.length > 156 && (
                      <>
                        <span> </span> {/* Add a space for visual separation */}
                        <span
                          onClick={toggleCaption}
                          className="text-blue-500 underline cursor-pointer"
                        >
                          See more
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
            <ul className="flex gap-1 mt-1">
              {post?.tags.map((tag, index) => (
                <li key={index} className="text-light-3 small-regular">
                  #{tag}
                </li>
              ))}
            </ul>
          </Link>
          <Carousel photos={post?.photos || []} />
        </div>
        <PostStats sharedAuthorId={author.id} postId={post.id} userId={user.id} shareId={id} type="shared" />
        <Comments postId={id} action="home" type="shared" />
      </div>
    </div>
  );
};

export default SharedPostCard;
