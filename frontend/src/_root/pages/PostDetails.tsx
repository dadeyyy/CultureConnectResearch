import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext, IPost } from "@/context/PostContext";
import { useEffect, useState } from "react";
import Carousel from "@/components/shared/Carousel";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoading, checkAuthUser } = useUserContext();
  const { postData, fetchPosts } = usePostContext();
  const [post, setPost] = useState<IPost | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthUser();
    };

    initializeAuth();
  }, [checkAuthUser]);
  console.log(user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postData.length) {
          await fetchPosts();
        }

        const postId = id ? parseInt(id, 10) : undefined;
        const foundPost = postData.find((post) => post.id === postId);

        if (foundPost) {
          setPost(foundPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id, postData, fetchPosts]);

  async function handleDeletePost(){
    const response = await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
      credentials:'include'
    })

    const data = await response.json();

    if(response.ok){
      console.log("SUCCESS", data)
      return navigate('/home')
    }
    else{
      console.log("FAILED", data)
    }
  }

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
        <div className="grid grid-cols-2 post_details-card p-5 ">
          <Carousel photos={post?.photos || []} />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.user.id}`} className="flex items-center gap-3">
                <img
                  src={post?.user.avatarUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="user"
                  className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
                />

                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-dark-1">
                    {post?.user.firstName} {post?.user.lastName}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.province} {post?.municipality}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.id}`}
                  className={`${user.id !== post?.user.id && "hidden"}`}
                >
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${user.id !== post?.user.id && "hidden"}`}
                >
                  <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>{" "}
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