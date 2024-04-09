import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext, IPost } from "@/context/PostContext";
import { useEffect, useState } from "react";
import Carousel from "@/components/shared/Carousel";
import Comments from "@/components/shared/Comments";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { municipalities, provincesTest } from "@/lib/provinces";
import ReportForm from "@/components/forms/ReportForm";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoading, checkAuthUser } = useUserContext();
  const { postData, fetchPosts } = usePostContext();
  const [post, setPost] = useState<IPost | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [openNestedAlertDialog, setOpenNestedAlertDialog] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthUser();
    };

    initializeAuth();
  }, [checkAuthUser]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postData.length) {
          await fetchPosts(5, 0);
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

  async function handleDeletePost() {
    const response = await fetch(`http://localhost:8000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      console.log("SUCCESS", data);
      return navigate("/home");
    } else {
      console.log("FAILED", data);
    }
  }

  const handleOptionSelect = (selectedValue: string) => {
    setSelectedOption(selectedValue);
    setOpenAlertDialog(true);
    setValue(selectedValue);
  };

  const handleCancel = () => {
    setOpenAlertDialog(false);
  };

  const handleContinue = () => {
    setOpenAlertDialog(false);
    setOpenNestedAlertDialog(true);
  };

  const handleNestedContinue = () => {
    setOpenNestedAlertDialog(false);
    if (value === "report") {
      window.location.href = "/home";
    }
  };

  const options = [{ label: "Report", value: "report" }];

  return (
    <div className="flex-1 overflow-auto py-5">
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
        <div className="post_details-card mx-auto p-2 ">
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.user.id}`} className="flex items-center gap-3">
                <img
                  src={post?.user.avatarUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="user"
                  className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
                />

                <div className="flex gap-1 flex-col">
                  <div className="flex flex-row text-center gap-2">
                    <p className="base-medium lg:body-bold text-dark-1">
                      {post?.user.firstName} {post?.user.lastName}
                    </p>
                    {user.id === post?.user.id && user.role === `ADMIN` && (
                      <Badge className="bg-green-300 font-light text-xs border border-gray-300">
                        {user.province}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="text-regular lg:text-sm ">
                      {multiFormatDateString(post?.createdAt)}
                    </p>
                    •
                    <p className="text-regular lg:text-sm">
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
              </Link>

              <div className="flex-center gap-1">
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

                <ReportForm userId={user.id} postId={post.id} postUserId={post.user.id} />
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>{" "}
            </div>
            <div className="w-full">
              <Carousel photos={post?.photos || []} />
              <PostStats post={post} userId={user.id} />
            </div>
          </div>

          <div className="post_details-info">
            <Comments postId={post.id} action="detail" />
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <h3 className="body-bold md:h3-bold w-full m-10">More Related Posts</h3>
        {/* {isUserPostLoading || !relatedPosts ? <Loader /> : <GridPostList posts={relatedPosts} />} */}
      </div>
    </div>
  );
};

export default PostDetails;
