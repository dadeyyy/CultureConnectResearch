import { Route, Routes, Link, Outlet, useParams, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
// import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GridPostList from "@/components/shared/GridPostList";
import { useEffect, useState } from "react";
import { ISharedPost } from "@/lib/utils";

interface StabBlockProps {
  value: string | number;
  label: string;
}

interface userProfile {
  imageUrl: string;
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

type IPost = {
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
  reportCount: number;
  updatedAt: string;
  user: {
    avatarUrl: string;
    firstName: string;
    id: number;
    lastName: string;
    role: string;
    username: string;
    province?: string;
  };
  userId: number;
  tags: string[];
};

type LikePost = {
  id: number;
  postId: number;
  userId: number;
  post: IPost;
};

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium test-dark-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  const [currentUser, setCurrentUser] = useState<userProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [sharedPost, setSharedPost] = useState<ISharedPost[]>([]);
  const [likedPost, setLikedPost] = useState<LikePost[]>([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-post/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        } else {
          console.error("eError fetching posts:");
        }
      } catch (error) {
        console.error("eError fetching posts:", error);
      }
    };

    getPosts();
  }, [id]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-shared-post/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setSharedPost(data);
        } else {
          console.error("eError fetching posts:");
        }
      } catch (error) {
        console.error("eError fetching posts:", error);
      }
    };

    getPosts();
  }, [id]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/likes/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setLikedPost(data);
        } else {
          console.error("eError fetching posts:");
        }
      } catch (error) {
        console.error("eError fetching posts:", error);
      }
    };

    getPosts();
  }, [id]);

  useEffect(() => {
    const fetchFollowingCount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/following-count/${id}`);
        const data = await response.json();

        if (response.ok) {
          setFollowingCount(data.followingCount);
        } else {
          console.error("Failed to fetch following count");
        }
      } catch (error) {
        console.error("Error fetching following count:", error);
      }
    };

    const fetchFollowersCount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/followers-count/${id}`);
        const data = await response.json();

        if (response.ok) {
          setFollowersCount(data.followersCount);
        } else {
          console.error("Failed to fetch followers count");
        }
      } catch (error) {
        console.error("Error fetching followers count:", error);
      }
    };

    fetchFollowingCount();
    fetchFollowersCount();
  }, [id]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCurrentUser((prevUser) => ({
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
  }, [id]);

  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const response = await fetch(`http://localhost:8000/is-following/${id}`);
        const data = await response.json();

        if (response.ok) {
          setIsFollowing(data.isFollowing);
        } else {
          console.error("Failed to check if user is following");
        }
      } catch (error) {
        console.error("Error checking if user is following:", error);
      }
    };

    checkIfFollowing();
  }, [id]);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const handleFollow = async () => {
    try {
      const response = await fetch("http://localhost:8000/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          followerId: user.id,
          followingId: currentUser.id,
        }),
      });

      if (response.ok) {
        setIsFollowing(true);
        setFollowersCount((prevCount) => prevCount + 1);
      } else {
        console.error("Failed to follow user:", response.statusText);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://localhost:8000/unfollow/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUser: user.id }),
      });

      if (response.ok) {
        setIsFollowing(false);
        setFollowersCount((prevCount) => prevCount - 1);
      } else {
        console.error("Failed to unfollow user:", response.statusText);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  console.log(likedPost);

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7 p-5">
          <Avatar className="w-28 h-28 lg:h-40 lg:w-40 object-cover rounded-full">
            <AvatarImage src={currentUser.imageUrl} alt={`profile-pictre`} />
            <AvatarFallback className="text-[50px]">
              {getInitials(currentUser.firstName, currentUser.lastName)}
            </AvatarFallback>
          </Avatar>
          {/* <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-40 lg:w-40 object-cover rounded-full"
          /> */}
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full capitalize">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="small-regular md:body-medium test-dark-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
              <div className="flex gap-8 mt-2 items-center justify-center xl:justify-start flex-wrap z-20">
                {/* <StatBlock value={currentUser.posts.length} label="Posts" /> */}
                <StatBlock value={followingCount} label="Following" />
                <StatBlock value={followersCount} label="Followers" />
              </div>
              <p>{currentUser.bio}</p>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.id}`}
                className={`h-12 bg-off-white px-5 test-dark-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.id && "hidden"
                }`}
              >
                <img src={"/assets/icons/edit.svg"} alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            </div>
            <div className={`${user.id === currentUser.id && "hidden"}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
                onClick={isFollowing ? handleUnfollow : handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-4/5 xs:w-full">
        <Tabs defaultValue="post" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="post" className="text-lg">
              Posts
            </TabsTrigger>
            <TabsTrigger value="shared" className="text-lg">
              Shared
            </TabsTrigger>
            <TabsTrigger value="likes" className="text-lg">
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="post">
            <Card className="pt-5">
              <CardContent className="justify-center flex">
                {!posts ? <div>The user has not posted yet.</div> : <GridPostList posts={posts} />}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="shared">
            <Card>
              <CardHeader>
                <CardTitle>Shared</CardTitle>
              </CardHeader>
              <CardContent className="justify-center flex">
                {!sharedPost ? (
                  <div>The user has not posted yet.</div>
                ) : (
                  <ul className="grid-container">
                    {sharedPost.map((post) => (
                      <li key={post.post.id} className="relative min-w-80 h-80">
                        <Link to={`/shared-post/${post.id}`} className="grid-post_link">
                          <img
                            src={post.post.photos[0].url}
                            alt="post"
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div className="grid-post_user">
                          <div className="flex items-center justify-start gap-2 flex-1">
                            <img
                              src={
                                post.post.user.avatarUrl || "/assets/icons/profile-placeholder.svg"
                              }
                              alt="creator"
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="line-clamp-1 capitalize">
                              {post.post.user.firstName} {post.post.user.lastName}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="likes">
            <Card>
              <CardHeader>
                <CardTitle>Likes</CardTitle>
              </CardHeader>
              <CardContent className="justify-center flex">
                {!likedPost ? (
                  <div>The user has not posted yet.</div>
                ) : (
                  <ul className="grid-container">
                    {likedPost.map((like) => (
                      <li key={like.post.id} className="relative min-w-80 h-80">
                        <Link to={`/posts/${like.post.id}`} className="grid-post_link">
                          <img
                            src={like.post.photos[0].url}
                            alt="post"
                            className="h-full w-full object-cover"
                          />
                        </Link>

                        <div className="grid-post_user">
                          <div className="flex items-center justify-start gap-2 flex-1">
                            <img
                              src={
                                like.post.user.avatarUrl || "/assets/icons/profile-placeholder.svg"
                              }
                              alt="creator"
                              className="w-8 h-8 rounded-full"
                            />
                            <p className="line-clamp-1 capitalize">
                              {like.post.user.firstName} {like.post.user.lastName}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
