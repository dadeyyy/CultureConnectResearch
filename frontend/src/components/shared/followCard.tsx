import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface userProfile {
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
const server ='http://localhost:8000'
const FollowCard = ({ userId }: { userId: string }) => {
  const { user, isLoading } = useUserContext();
  const [userProfile, setUserProfile] = useState<userProfile>();
  const [isFollowing, setIsFollowing] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${server}/user/${userId}`,{
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setUserProfile((prevUser) => ({
            ...prevUser,
            ...data.user,
          }));
        } else {
          console.error("Failed to fetch current user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`${server}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followerId: user.id, followingId: userId }),
        credentials: "include"
      });

      if (response.ok) {
        setIsFollowing(true);
      } else {
        console.error("Failed to follow user:", response.statusText);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`${server}/unfollow/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUser: user.id }),
      });

      if (response.ok) {
        setIsFollowing(false);
      } else {
        console.error("Failed to unfollow user:", response.statusText);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="w-96 flex flex-row justify-between">
      {!userProfile ? (
        <></>
      ) : (
        <>
          <Link to={`/profile/${userId}`}>
            <div className="flex flex-row gap-2">
              <Avatar>
                <AvatarImage src={userProfile.imageUrl  || ''} alt={`profile-pictre`} />
                <AvatarFallback>
                  {getInitials(userProfile.firstName, userProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col ">
                <span className="text-md font-bold capitalize">
                  {userProfile.firstName} {userProfile.lastName}
                </span>
                <span>@{userProfile.username}</span>
              </div>
            </div>
          </Link>

          <Button
            type="button"
            className="shad-button_primary px-8"
            onClick={isFollowing ? handleUnfollow : handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </>
      )}
    </div>
  );
};

export default FollowCard;
