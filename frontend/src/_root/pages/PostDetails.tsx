import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import PostStats from "@/components/shared/PostStats";

import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { DummyPost, getPostById } from "@/dummy/dummy";
import { useEffect, useState } from "react";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  const [post, setPost] = useState<DummyPost | undefined>(undefined);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  console.log(post);

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button onClick={() => navigate(-1)} variant="ghost" className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
            style={{
              filter:
                "invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(0%) contrast(119%)",
            }}
            className="fill-current text-black"
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="creator" className="post_details-img" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
                />

                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-dark-1">
                    {post?.creator.firstName} {post?.creator.lastName}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.province} {post?.municipal}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.id && "hidden"}`}
                >
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                {/* <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                </Button> */}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              {/* <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul> */}
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
        {/* {isUserPostLoading || !relatedPosts ? <Loader /> : <GridPostList posts={relatedPosts} />} */}
      </div>
    </div>
  );
};

export default PostDetails;
