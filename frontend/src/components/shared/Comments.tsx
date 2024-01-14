// Comments.tsx

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { multiFormatDateString } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { filterInappropriateWords } from '@/lib/CaptionFilter';
import CommentCard from './CommentCard';
import toast from 'react-hot-toast';
=======
import { useState, useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CommentCard from "./CommentCard";
import toast from "react-hot-toast";
>>>>>>> 5556e92ba406400636c02e9dae5daa832f92d1f2
interface CommentProps {
  postId: number;
  action: 'home' | 'detail';
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
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(comments.length).fill(false)
  );
  const [value, setValue] = useState('');
  const [commentUser, setCommentUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const options = [{ label: 'Delete', value: 'delete' }];

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/post/${postId}/comments`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        setComments(data.comments);
        setOpenStates(Array(data.comments.length).fill(false)); // Initialize open states for each comment
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleOptionSelect = async (selectedValue: string, index: number) => {
    setOpenStates((prevOpenStates) =>
      prevOpenStates.map((prevState, i) =>
        i === index ? !prevState : prevState
      )
    );
    setValue(selectedValue);

    if (selectedValue === 'edit') {
      // EDIT
<<<<<<< HEAD
    } else if (selectedValue === 'delete') {
=======
    } else if (selectedValue === "delete") {
>>>>>>> 5556e92ba406400636c02e9dae5daa832f92d1f2
      try {
        const response = await fetch(
          `http://localhost:8000/post/${postId}/comment/${comments[index].id}`,
          {
<<<<<<< HEAD
            credentials: 'include',
            method: 'DELETE',
=======
            credentials: "include",
            method: "DELETE",
>>>>>>> 5556e92ba406400636c02e9dae5daa832f92d1f2
          }
        );

        const data = await response.json();

        if (response.ok) {
          toast.success(`${data.message}`);
          return;
        } else {
<<<<<<< HEAD
          toast.error('Failed to delete comment');
=======
          toast.error("Failed to delete comment");
>>>>>>> 5556e92ba406400636c02e9dae5daa832f92d1f2
        }
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/post/${postId}/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newComment,
          }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        console.error(
          'Error submitting comment. Server responded with:',
          response
        );
        return;
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setOpenStates([...openStates, false]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const toggleComments = () => {
    navigate(`/posts/${postId}`);
  };

  const numberOfCommentsToShow = action === 'detail' ? comments.length : 1;
  const displayedComments = comments.slice(0, numberOfCommentsToShow);

  return (
    <div className={`post-comments border my-5 border-light-4`}>
      <h2
        className={`${
          action === 'home' ? 'hidden p-0' : ''
        } font-bold ml-5 text-lg`}
      >
        Comments
      </h2>
      {action === 'home' && comments.length > 0 && (
        <Button
          type="button"
          onClick={toggleComments}
          className={`mt-2 text-sm font-semibold text-gray-500 hover:text-gray-800 focus:outline-none ${
            showComments ? 'hidden' : ''
          }`}
        >
          Show Comments
        </Button>
      )}

      <div
        className={`mt-2 overflow-y-auto  ${
          action === 'detail' ? 'pt-5 lg:h-96' : ''
        }`}
      >
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
      <div className="flex gap-3 items-center w-full">
        <img
          src={
            isLoading
              ? '/assets/icons/profile-placeholder.svg'
              : user.imageUrl || '/assets/icons/profile-placeholder.svg'
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
              <img
                src="/assets/icons/send.svg"
                width={20}
                height={20}
                alt="send"
              />
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default Comments;
