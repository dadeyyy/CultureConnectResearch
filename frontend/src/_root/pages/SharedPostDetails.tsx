import { Link, useNavigate, useParams } from "react-router-dom";
import { ISharedPost, multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { filterInappropriateWords } from "@/lib/CaptionFilter";
import { municipalities, provincesTest } from "@/lib/provinces";
import { useEffect, useState } from "react";
import PostStats from "@/components/shared/PostStats";
import Comments from "@/components/shared/Comments";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import Carousel from "@/components/shared/Carousel";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  caption: z.string().min(0, {
    message: "You cannot create a post without a caption.",
  }),
});
const server = 'http://localhost:8000'
const SharedPostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isLoading } = useUserContext();
  const [sharedPost, setSharedPost] = useState<ISharedPost>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${server}/shared-post/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const postData = await response.json();
        setSharedPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  async function handleDeletePost() {
    const response = await fetch(`${server}/shared-post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Deleted successfully");
      return navigate("/home");
    } else {
      console.log("FAILED", data);
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="w-full lg:px-5 xs:p-0">
      <div className="flex-1 max-h-screen overflow-auto lg:py-5 xs:p-0">
        <div className="hidden md:flex w-full mb-5">
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
        {isLoading || !sharedPost ? (
          <Loader />
        ) : (
          <div className="flex flex-col w-full border border-gray-200 p-5 rounded-xl gap-3">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <Link to={`/profile/${sharedPost.userId}`}>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={sharedPost.user.avatarUrl} alt={`profile-pictre`} />
                      <AvatarFallback>
                        {getInitials(sharedPost.user.firstName, sharedPost.user.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <div className="flex flex-row text-center gap-2">
                        <p className="base-medium lg:text-base capitalize text-dark-1">
                          {sharedPost.user.firstName} {sharedPost.user.lastName}
                        </p>
                        {sharedPost.user.role === `ADMIN` && (
                          <Badge className="bg-green-300 font-semibold text-xs border text-gray-600 capitalize border-gray-300">
                            {sharedPost?.user.province}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 text-dark-3">
                        <p className="subtle-regular xs:text-xs">
                          {multiFormatDateString(sharedPost.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to={`/shared-post/${sharedPost.id}`}>
                  <div className="small-medium lg:base-medium">
                    <p className="text-justify">{filterInappropriateWords(sharedPost.caption)}</p>
                  </div>
                </Link>
              </div>

              <Button
                onClick={handleDeletePost}
                variant="ghost"
                className={`ost_details-delete_btn ${user.id !== sharedPost.userId && "hidden"}`}
              >
                <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
              </Button>
            </div>

            <div className="grid lg:grid-cols-5 xs:grid-cols-1 rounded-xl w-full mx-auto border">
              <div className="w-full col-span-3">
                <Carousel photos={sharedPost.post.photos || []} />
              </div>

              <div className="post_details-info border border-transparent border-l-slate-500 col-span-2">
                <Link to={`/profile/${sharedPost.post.userId}`} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={sharedPost.post.user.avatarUrl} alt={`profile-pictre`} />
                    <AvatarFallback>
                      {getInitials(sharedPost.post.user.firstName, sharedPost.post.user.lastName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex gap-0 flex-col">
                    <div className="flex flex-row text-center gap-0">
                      <p className="font-semibold lg:text-lg capitalize text-dark-1">
                        {sharedPost.post.user.firstName} {sharedPost.post.user.lastName}
                      </p>
                      {sharedPost.post.user.role === `ADMIN` && (
                        <Badge className="bg-green-300 font-semibold text-xs border text-gray-600 capitalize border-gray-300">
                          {sharedPost.post.user.province}
                        </Badge>
                      )}
                    </div>
                    <div className="flex-start gap-2 text-light-3">
                      <p className="text-regular lg:text-sm ">
                        {multiFormatDateString(sharedPost.post.createdAt)}
                      </p>
                      •
                      <p className="text-regular lg:text-sm">
                        {"In "}
                        {sharedPost.post.municipality &&
                          municipalities[sharedPost.post.province]?.find(
                            (municipal) => municipal.value === sharedPost.post.municipality
                          )?.label}
                        {", "}
                        {sharedPost.post.province &&
                          provincesTest.find(
                            (province) => province.value === sharedPost.post.province
                          )?.label}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                  <Link to={`/posts/${sharedPost.post.id}`}>
                    <p>{sharedPost.post.caption}</p>{" "}
                    <ul className="flex gap-1 mt-2">
                      {sharedPost.post.tags.map((tag, index) => (
                        <li key={index} className="text-light-3 small-regular">
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </div>
              </div>
            </div>
            <div className="px-5">
              <PostStats
                postId={sharedPost.post.id}
                shareId={sharedPost.id}
                userId={user.id}
                type="shared"
              />
              <Comments postId={sharedPost.id} action="detail" type="shared" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedPostDetails;
