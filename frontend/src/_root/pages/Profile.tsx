import { Route, Routes, Link, Outlet, useParams, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
// import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";
import { DummyUser, getUserById } from "@/dummy/dummy";
import { useEffect, useState } from "react";

interface StabBlockProps {
  value: string | number;
  label: string;
}

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
  const [isLoading, setIsLoading] = useState(true);

  const [currentUser, setUserData] = useState<DummyUser | undefined>(undefined);
  console.log(id);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedUserData = await getUserById(id);
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  console.log(currentUser);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 object-cover  rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.firstName} {currentUser.lastName}
              </h1>
              <p className="small-regular md:body-medium test-dark-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {/* <StatBlock value={currentUser.posts.length} label="Posts" /> */}
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
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
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {currentUser.id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-light-4"}`}
          >
            <img src={"/assets/icons/posts.svg"} alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-light-4"
            }`}
          >
            <img src={"/assets/icons/like.svg"} alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />} />
        {/* {currentUser.$id === user.id && <Route path="/liked-posts" element={<LikedPosts />} />} */}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
