import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { IPost, multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Carousel from "@/components/shared/Carousel";
import Comments from "@/components/shared/Comments";
import { Badge } from "@/components/ui/badge";
import { municipalities, provincesTest } from "@/lib/provinces";
import ReportForm from "@/components/forms/ReportForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PostForm from "@/components/forms/PostForm";
import toast from "react-hot-toast";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoading } = useUserContext();
  const [post, setPost] = useState<IPost>();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${id}`, {
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

  async function handleDeletePost() {
    const response = await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Deleted Successfully");
      return navigate("/home");
    } else {
      toast.error("Failed to delete");
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <>
      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="w-full p-5">
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
          <div className=" w-full lg:w-full flex lg:flex-row xs:flex-col rounded-xl border-gray-500 border">
            <div className="border border-transparent lg:border-r-gray-500 object-cover lg:w-[75vh] xs:w-full">
              <Carousel photos={post.photos || []} />
              <div className="px-5">
                <PostStats postId={post.id} userId={user.id} type="regular" />
              </div>
            </div>

            <div className="post_details-info overflow-y-auto custom-scrollbar max-h-[85vh] w-full">
              <div className="flex-between w-full pt-2">
                <Link to={`/profile/${post.userId}`} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.user.avatarUrl} alt={`profile-pictre`} />
                    <AvatarFallback>
                      {getInitials(post.user.firstName, post.user.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex gap-1 flex-col">
                    <div className="flex flex-row text-center gap-2">
                      <p className="lg:text-base truncate xs:text-sm body-bold text-dark-1 capitalize">
                        {post.user.firstName} {post.user.lastName}
                      </p>
                      {user.id === post.userId && user.role === `ADMIN` && (
                        <Badge className="bg-green-300 font-semibold text-xs border text-gray-600 capitalize border-gray-300">
                          {user.province}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 text-light-3">
                      <p className="text-xs ">{multiFormatDateString(post.createdAt)}</p>•
                      <p className="text-xs">
                        {"In "}
                        {post.municipality &&
                          municipalities[post.province]?.find(
                            (municipal) => municipal.value === post.municipality
                          )?.label}
                        {", "}
                        {post.province &&
                          provincesTest.find((province) => province.value === post.province)?.label}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex-center gap-1">
                  <Sheet>
                    <SheetTrigger asChild>
                      <img
                        src={"/assets/icons/edit.svg"}
                        alt="edit"
                        className={`w-5 xs:w-4 ${user.id !== post.userId && "hidden"}`}
                      />
                    </SheetTrigger>
                    <SheetContent
                      className="xl:min-w-[1080px] xs:w-full max-h-full  py-5"
                      side={"left"}
                    >
                      <div className="w-full flex flex-col h-full">
                        <div className="flex justify-between">
                          <SheetHeader>
                            <SheetTitle className="font-bold text-lg">Update Post</SheetTitle>
                          </SheetHeader>
                        </div>
                        <PostForm action="Update" post={post} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className={`ost_details-delete_btn ${user.id !== post.userId && "hidden"}`}
                  >
                    <img src={"/assets/icons/delete.svg"} alt="delete" className={`w-5 xs:w-4`} />
                  </Button>

                  <ReportForm userId={user.id} postId={post.id} postUserId={post.userId} />
                </div>
              </div>
              <hr className="border w-full border-dark-4/80" />
              <div className="flex flex-col w-full small-medium lg:base-regular overflow">
                <p>{post.caption}</p>
                <ul className="flex gap-1">
                  {post.tags.map((tag, index) => (
                    <li key={index} className="text-light-3 small-regular">
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full h-full py-2">
                <Comments postId={post.id} action="detail" type="regular" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetails;
