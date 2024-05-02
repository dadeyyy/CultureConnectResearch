import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import Carousel from './Carousel';
import { filterInappropriateWords } from '@/lib/CaptionFilter';
import Comments from './Comments';
import { municipalities, provincesTest } from '@/lib/provinces';
import ReportForm from '../forms/ReportForm';
import { Badge } from '../ui/badge';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
      createdAt: string;
      firstName: string;
      id: number;
      lastName: string;
      role: string;
      username: string;
      province?: string;
    };
    tags: string[];
  };
  userId: number;
}
const PostCard = ({ post }: PostCardProps) => {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const truncatedCaption =
    post.caption.length > 128
      ? `${post.caption.slice(0, post.caption.lastIndexOf(' ', 156))}...`
      : post.caption;
  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };

  const { user } = useUserContext();

  if (!post.user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };
  return (
    <div className="post-card">
      <div className="flex-between">
        <Link to={`/profile/${post.user.id}`}>
          <div className="flex items-center gap-2">
            {!post && <span>no post found</span>}
            <Avatar>
              <AvatarImage src={post.user.avatarUrl || ''} alt={`profile-pictre`} />
              <AvatarFallback>
                {getInitials(post?.user.firstName, post?.user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <div className="flex flex-row text-center gap-2">
                <p className="base-medium lg:body-bold text-dark-1 capitalize">
                  {post.user.firstName} {post.user.lastName}
                </p>
                {post?.user.role === `ADMIN` && (
                  <Badge className="bg-green-300 font-semibold text-xs border text-dark border-gray-300 capitalize">
                    {post?.user?.province}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2 text-dark-3">
                <p className="subtle-regular xs:text-xs">
                  {multiFormatDateString(post.createdAt)}
                </p>
                <p className="subtle-regular xs:text-xs">
                  {'In '}
                  {post?.municipality &&
                    municipalities[post.province]?.find(
                      (municipal) => municipal.value === post.municipality
                    )?.label}
                  {', '}
                  {post?.province &&
                    provincesTest.find(
                      (province) => province.value === post.province
                    )?.label}
                </p>
              </div>
            </div>
          </div>
        </Link>

        <ReportForm
          userId={user.id}
          postId={post.id}
          postUserId={post.user.id}
        />
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-2">
          <p className="text-justify text-base font-normal">
            {showFullCaption ? (
              filterInappropriateWords(post.caption)
            ) : (
              <>
                {filterInappropriateWords(truncatedCaption)}
                {post.caption.length > 156 && (
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
          {post.tags.map((tag, index) => (
            <li key={index} className="text-light-3 small-regular">
              #{tag}
            </li>
          ))}
        </ul>
      </Link>
      <Carousel photos={post?.photos || []} />

      <PostStats postId={post.id} userId={user.id} type="regular" />
      <Comments postId={post.id} action="home" type="regular" />
    </div>
  );
};

export default PostCard;
