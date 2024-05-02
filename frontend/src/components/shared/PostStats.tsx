import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "../ui/badge";
import { IPost, multiFormatDateString } from "@/lib/utils";
import { municipalities, provincesTest } from "@/lib/provinces";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const formSchema = z.object({
  caption: z.string().min(0, {
    message: "You cannot create a post without a caption.",
  }),
});

interface PostStatsProps {
  postId: number;
  userId: number;
  shareId?: number;
  type: "regular" | "shared";
}

const PostStats = ({ postId, userId, shareId, type }: PostStatsProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useUserContext();
  const [post, setPost] = useState<IPost>();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
    },
  });

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
  }, [postId]);

  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/${
            type === "regular" ? `post/${postId}` : `shared-post/${shareId}`
          }/comments`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data) {
          setCommentCount(data.comments.length);
        }
      } catch (error) {
        console.error("Error fetching comment count:", error);
      }
    };

    fetchCommentCount();
  }, [postId]);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/${
            type === "regular" ? `post/${postId}` : `shared/${shareId}`
          }/like-status`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error("Error checking like status. Server responded with:", response);
          return;
        }

        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.count);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [postId]);

  const handleLikePost = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    try {
      const response = await fetch(
        `http://localhost:8000/${type === "regular" ? `post/${postId}` : `shared/${shareId}`}/like`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Error liking post. Server responded with:", response);
        return;
      }

      const data = await response.json();
      setLikeCount(data.count);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const response = await fetch(`http://localhost:8000/post/share/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        console.error("Error liking post. Server responded with:", response);
        return;
      }
      toast.success("Shared Successfully");
      navigate(`/home`);
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to Share");
    }
  };

  const containerStyles = location.pathname.startsWith("/profile") ? "w-full" : "";

  return (
    <div className={`flex justify-between w-full items-center my-5 z-20 ${containerStyles}`}>
      <div className="flex gap-2 mr-5">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likeCount}</p>
      </div>
      <a
        onClick={() => {
          navigate(`/${type === "regular" ? `posts/${postId}` : `shared-post/${shareId}`}`);
        }}

        className={`hover:cursor-pointer focus:outline-none  ${showComments ? "hidden" : ""}`}
      >
        <div className="flex flex-row gap-1">
          <img
            src={"/assets/icons/comment.svg"}
            alt="comment"
            width={25}
            height={25}
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{commentCount}</p>
        </div>
      </a>

      <Dialog>
        <DialogTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-pointer">
            <img
              src={"/assets/icons/share.svg"}
              alt="comment"
              width={25}
              height={25}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium text-center">Share</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[560px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleShare)} encType="multipart/form-data">
              <DialogHeader className="flex flex-row justify-center  border-2 border-transparent border-b-gray-300 items-center p-2">
                <DialogTitle className="text-xl font-bold">Share Post</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 ">
                <div className="flex gap-3 items-center mt-5 hover:cursor-pointer">
                  <img
                    src={
                      isLoading
                        ? "/assets/icons/profile-placeholder.svg"
                        : user.imageUrl || "/assets/icons/profile-placeholder.svg"
                    }
                    alt="profile picture"
                    className="h-12 w-12 rounded-full bg-cover"
                  />
                  <div
                    className="flex flex-col"
                    onClick={() => {
                      window.location.href = `/profile/${user.id}`;
                    }}
                  >
                    {isLoading || !user.id ? (
                      <p>Loading...</p>
                    ) : (
                      <>
                        <p className="font-bold text-regular">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="small-regular text-light-3">@{user.username}</p>
                      </>
                    )}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="shad-form_label">Caption</FormLabel>
                      <FormControl>
                        <Textarea
                          className="shad-textarea custom-scrollbar"
                          placeholder="Caption here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="shad-form_message" />
                    </FormItem>
                  )}
                />

                <div className="max-h-[720px] w-full scrollbar-y-auto custom-scrollbar border border-gray-200">
                  {/* display the post photos here */}
                  <Carousel className="max-w-[360px] m-auto">
                    <CarouselContent>
                      {post?.photos.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-video items-center justify-center p-0">
                                <img
                                  src={image.url}
                                  className="object-cover w-full"
                                  alt="carousel-image"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {(post?.photos?.length ?? 0) < 1 ? (
                      <>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>
                    ) : (
                      <></>
                    )}
                  </Carousel>

                  <div className="flex items-center gap-3">
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
                            municipalities[post?.province]?.find(
                              (municipal) => municipal.value === post?.municipality
                            )?.label}
                          {", "}
                          {post?.province &&
                            provincesTest.find((province) => province.value === post?.province)
                              ?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Share post
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostStats;
