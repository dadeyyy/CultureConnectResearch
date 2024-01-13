import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
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
import { useState } from "react";
import { Button } from "../ui/button";
import Carousel from "./Carousel";
import { filterInappropriateWords } from "@/lib/CaptionFilter";
import Comments from "./Comments";
import toast from "react-hot-toast";
import { municipalities, provincesTest } from "@/lib/provinces";

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
    };
  };
  userId: number;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [openNestedAlertDialog, setOpenNestedAlertDialog] = useState(false);

  const handleOptionSelect = (selectedValue: string) => {
    setSelectedOption(selectedValue);
    setOpenAlertDialog(true);
    setValue(selectedValue);
  };

  const handleCancel = () => {
    setOpenAlertDialog(false);
  };

  const handleContinue = async () => {
    try {
      const response = await fetch(`http://localhost:8000/post/${post.id}/report`, {
        credentials: "include",
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      setOpenAlertDialog(false);
      setOpenNestedAlertDialog(true);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleNestedContinue = () => {
    setOpenNestedAlertDialog(false);
    if (value === "report") {
      window.location.href = "/home";
    }
  };
  const options = [{ label: "Report", value: "report" }];

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
            <p className="base-medium lg:body-bold text-dark-1">
              {post.user.firstName} {post.user.lastName}
            </p>
            <div className="flex-center gap-2 text-dark-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post?.municipality &&
                  municipalities[post.province]?.find(
                    (municipal) => municipal.value === post.municipality
                  )?.label}{" "}
                {" at "}
                {post?.province &&
                  provincesTest.find((province) => province.value === post.province)?.label}
              </p>
            </div>
          </div>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <img src={"/assets/icons/three-dots.svg"} alt="edit" width={20} height={20} />
          </PopoverTrigger>
          <PopoverContent className="w-[200px] bg-light-2 p-0" side="top" align="end">
            <Command>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleOptionSelect}
                    className="hover:bg-primary-1 cursor-pointer transition-colors"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <AlertDialog open={openAlertDialog}>
                <AlertDialogContent className="bg-light-2">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Report post.</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure reporting this post?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogTrigger asChild>
                      <Button onClick={handleContinue}>Submit</Button>
                    </AlertDialogTrigger>
                  </AlertDialogFooter>
                </AlertDialogContent>

                <AlertDialog open={openNestedAlertDialog}>
                  <AlertDialogContent className="bg-light-2">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Report Submitted.</AlertDialogTitle>
                      <AlertDialogDescription>
                        Thank you for reporting this post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction onClick={handleNestedContinue}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </AlertDialog>
            </Command>
          </PopoverContent>
        </Popover>
        {/* <Link
          to={`/update-post/${post.id}`}
          className={`${user.id !== post.user.id && "hidden"}`}
        >
          <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
        </Link> */}
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
