// ComponentCard.tsx
import React from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { multiFormatDateString } from "@/lib/utils";

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

interface Comment {
  content: string;
  createdAt: string;
  id: number;
  postId: number;
  updatedAt: string;
  userId: number;
}

interface ComponentCardProps {
  comment: Comment;
  commentUser: UserProfile | null;
  openState: boolean;
  handleOptionSelect: (selectedValue: string) => void;
  user: UserProfile;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  comment,
  commentUser,
  openState,
  handleOptionSelect,
  user,
}) => {
  return (
    <div className="flex gap-3 mb-3 items-center">
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
        <div>{comment.content}</div>
      </p>
      <p className="text-dark-3 subtle-regular"></p>
      {comment.userId === user.id && (
        <Popover open={openState} onOpenChange={() => handleOptionSelect(comment.id)}>
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
                <CommandItem
                  value="edit"
                  onSelect={() => handleOptionSelect("edit")}
                  className="hover:bg-primary-1 cursor-pointer transition-colors"
                >
                  Edit
                </CommandItem>
                <CommandItem
                  value="delete"
                  onSelect={() => handleOptionSelect("delete")}
                  className="hover:bg-primary-1 cursor-pointer transition-colors"
                >
                  Delete
                </CommandItem>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ComponentCard;
