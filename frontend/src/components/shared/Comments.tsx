// Comments.tsx
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CommentCard from "./CommentCard";
import toast from "react-hot-toast";

interface CommentProps {
  postId: number;
  action: "home" | "detail";
  type: "regular" | "shared";
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
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const Comments = ({ postId, action, type }: CommentProps) => {
  const { user, isLoading } = useUserContext();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [openStates, setOpenStates] = useState<boolean[]>(Array(comments.length).fill(false));
  const [value, setValue] = useState("");
  const [commentUser, setCommentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const options = [{ label: "Delete", value: "delete" }];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${server}/${type === "shared" ? "shared-post" : "post"}/${postId}/comments`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setComments(data.comments);
        setOpenStates(Array(data.comments.length).fill(false)); // Initialize open states for each comment
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleOptionSelect = async (selectedValue: string, index: number) => {
    setOpenStates((prevOpenStates) =>
      prevOpenStates.map((prevState, i) => (i === index ? !prevState : prevState))
    );
    setValue(selectedValue);

    if (selectedValue === "edit") {
      // EDIT
    } else if (selectedValue === "delete") {
      try {
        const response = await fetch(
          `${server}/${type === "shared" ? "shared-post" : "post"}/${postId}/comment/${
            comments[index].id
          }`,
          {
            credentials: "include",
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success(`${data.message}`);
          return;
        } else {
          toast.error("Failed to delete comment");
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `${server}/${type === "shared" ? "shared-post" : "post"}/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment,
          }),
          credentials: "include",
        }
      );

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

  const numberOfCommentsToShow = action === "detail" ? comments.length : 1;
  const displayedComments = comments.slice(0, numberOfCommentsToShow);

  return (
    <div className={`px-2 border border-transparent border-t-light-4 h-full`}>
      <h2 className={`${action === "home" ? "hidden p-0" : ""} font-bold ml-5 text-lg`}>
        Comments
      </h2>
      {action === "home" && comments.length > 0 && (
        <a
          onClick={toggleComments}
          className={`mt-2 text-sm font-semibold text-gray-500 hover:text-gray-800 hover:cursor-pointer focus:outline-none ${
            showComments ? "hidden" : ""
          }`}
        >
          Show Comments
        </a>
      )}

      <div className={`flex flex-col h-[100%] ${action === "detail" ? "h-full" : ""}`}>
        <div className="py-2">
          {displayedComments.map((comment, index) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              index={index}
              openStates={openStates}
              setOpenStates={setOpenStates}
              handleOptionSelect={handleOptionSelect}
            />
          ))}
        </div>
        <div className="flex gap-3 items-center w-full my-2 sticky">
          <img
            src={
              isLoading
                ? "/assets/icons/profile-placeholder.svg"
                : user.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile picture"
            className="h-12 w-12 rounded-full bg-cover"
          />
          <div className="flex w-full py-2 bg-red-200 rounded-xl px-2">
            <>
              <Input
                type="text"
                placeholder="Add a comment"
                className="w-full border border-white border-b-2 bg-gray-100 border-b-slate-950"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                type="button"
                className="hover:bg-transparent hover:scale-150 transition ease-in-out delay-150 bg-transparent"
                onClick={handleCommentSubmit}
              >
                <img src="/assets/icons/send.svg" width={20} height={20} alt="send" />
              </Button>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
