import { useState, useEffect } from "react";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { filterInappropriateWords } from "@/lib/CaptionFilter";

interface CommentProps {
  postId: number;
  action: "home" | "detail";
}

interface Comment {
  content: string;
  createdAt: string;
  id: number;
  postId: number;
  updatedAt: string;
  userId: number;
}

interface UserProfile {
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
}

const Comments = ({ postId, action }: CommentProps) => {
  const { user, isLoading } = useUserContext();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [openStates, setOpenStates] = useState<boolean[]>(Array(comments.length).fill(false));
  const [value, setValue] = useState("");
  const [commentUser, setCommentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const options = [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8000/post/${postId}/comments`, {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        setComments(data.comments);
        setOpenStates(Array(data.comments.length).fill(false)); // Initialize open states for each comment
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    const fetchCommentUser = async (userId: number) => {
      try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setCommentUser(data.user);
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    if (comments.length > 0) {
      fetchCommentUser(comments[0].userId);
    }
  }, [comments]);

  const handleOptionSelect = async (selectedValue: string, index: number) => {
    setOpenStates((prevOpenStates) =>
      prevOpenStates.map((prevState, i) => (i === index ? !prevState : prevState))
    );
    setValue(selectedValue);

    if (selectedValue === "edit") {
      // EDIT
    } else if (selectedValue === "delete") {
      // DELETE
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/post/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Error submitting comment. Server responded with:", response);
        return;
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setOpenStates([...openStates, false]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleComments = () => {
    navigate(`/posts/${postId}`);
  };

  console.log(user);
  console.log(comments);

  const numberOfCommentsToShow = action === "detail" ? comments.length : 1;
  const displayedComments = comments.slice(0, numberOfCommentsToShow);

  return (
    <div className={`post-comments border my-5 border-light-4`}>
      <h2 className={`${action === "home" ? "hidden p-0" : ""} font-bold ml-5 text-lg`}>
        Comments
      </h2>
      {action === "home" && comments.length > 0 && (
        <Button
          type="button"
          onClick={toggleComments}
          className={`mt-2 text-sm font-semibold text-gray-500 hover:text-gray-800 focus:outline-none ${
            showComments ? "hidden" : ""
          }`}
        >
          Show Comments
        </Button>
      )}

      <div className={`mt-2 overflow-y-auto  ${action === "detail" ? "pt-5 h-96" : ""}`}>
        {displayedComments.map((comment, index) => (
          <div key={comment.id} className="flex gap-3 mb-3 items-center">
            <img
              src={commentUser?.avatarUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile picture"
              className="h-8 w-8 rounded-full bg-cover"
            />
            <p className="text-dark-1">
              <span className="font-bold">
                {commentUser?.firstName} {commentUser?.lastName}:{" "}
                <span className="text-gray-500 text-regular text-sm">
                  {multiFormatDateString(comment.createdAt.toString())}
                </span>
              </span>
              <div>{filterInappropriateWords(comment.content)}</div>
            </p>
            <p className="text-dark-3 subtle-regular"></p>
            {comment.userId === user.id && (
              <Popover
                open={openStates[index]}
                onOpenChange={(isOpen) =>
                  setOpenStates((prevStates) =>
                    prevStates.map((prev, i) => (i === index ? isOpen : prev))
                  )
                }
              >
                <PopoverTrigger asChild>
                  <img
                    src={"/assets/icons/three-dots.svg"}
                    alt="profile picture"
                    className="h-5 w-5 rounded-full hover:opacity-70 transition-opacity ml-auto"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-light-2" side="bottom" align="start">
                  <Command>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleOptionSelect(option.value, index)}
                          className="hover:bg-primary-1 cursor-pointer transition-colors"
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-3 items-center w-full">
        <img
          src={
            isLoading
              ? "/assets/icons/profile-placeholder.svg"
              : user.imageUrl || "/assets/icons/profile-placeholder.svg"
          }
          alt="profile picture"
          className="h-12 w-12 rounded-full bg-cover"
        />
        <div className="flex w-full">
          <>
            <Input
              type="text"
              placeholder="Add a comment"
              className="w-full border-b-2 border-slate-950"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="button" onClick={handleCommentSubmit}>
              <img src="/assets/icons/send.svg" width={20} height={20} alt="send" />
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default Comments;
