// CommentCard.tsx

import React, { useState, useEffect } from "react";
import { multiFormatDateString } from "@/lib/utils";
import { filterInappropriateWords } from "@/lib/CaptionFilter";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserContext } from "@/context/AuthContext";

interface CommentCardProps {
  comment: Comment;
  index: number;
  openStates: boolean[];
  setOpenStates: React.Dispatch<React.SetStateAction<boolean[]>>;
  handleOptionSelect: (selectedValue: string, index: number) => void;
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
  imageUrl: string | null;
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
const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  index,
  openStates,
  setOpenStates,
  handleOptionSelect,
}) => {
  const { user } = useUserContext();
  const [commentUser, setCommentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchCommentUser = async (userId: number) => {
      try {
        const response = await fetch(`${server}/user/${userId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setCommentUser(data.user);
        } else {
          console.error("Failed to fetch comment user");
        }
      } catch (error) {
        console.error("Error fetching comment user:", error);
      }
    };
    fetchCommentUser(comment.userId);
  }, [comment.userId]);

  const options = [{ label: "Delete", value: "delete" }];

  return (
    <div key={comment.id} className="flex gap-3 mb-3 items-center">
      <div className="text-dark-1 flex flex-row gap-2 ">
        <img
          src={commentUser?.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile picture"
          className="h-8 w-8 rounded-full bg-cover"
        />

        <div className="flex-col flex">
          <div className="flex-col flex bg-gray-200 rounded-lg p-2">
            <span className="font-bold text-base">
              {commentUser?.firstName} {commentUser?.lastName}
            </span>
            <span className="text-sm text-start">{filterInappropriateWords(comment.content)}</span>
          </div>
          <span className="text-gray-500 text-xs">
            {multiFormatDateString(comment.createdAt.toString())}
          </span>
        </div>
      </div>

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
  );
};

export default CommentCard;
