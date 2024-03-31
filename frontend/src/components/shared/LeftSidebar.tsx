import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading, checkAuthUser } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      if (!user.id) {
        await checkAuthUser();
      }
    };
    fetchData();
  }, [checkAuthUser, user.id]);

  const sidebarLinks = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/home",
      label: "Home",
    },
    {
      imgURL: "/assets/icons/for-you.svg",
      route: "/for-you",
      label: "For You",
    },
    user.role === "ADMIN"
      ? {
          imgURL: "/assets/icons/reports.svg",
          route: "/reports",
          label: "Reports",
        }
      : null,
    {
      imgURL: "/assets/icons/explore.svg",
      route: "/explore",
      label: "Explore",
    },
    {
      imgURL: "/assets/icons/map.svg",
      route: "/map",
      label: "Map",
    },
    {
      imgURL: "/assets/icons/calendar.svg",
      route: "/calendar",
      label: "Calendar",
    },
    {
      imgURL: "/assets/icons/live-stream.svg",
      route: "/live-streams",
      label: "Live Streams",
    },
    {
      route: "/create-post",
      label: "Create Post",
    },
  ].filter(Boolean);

  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    localStorage.removeItem("currentUser");

    return navigate("/");
  };

  return (
    <nav className="leftsidebar sticky border border-r-gray-300">
      <div className="flex flex-col gap-7">
        <Link to="/home" className="flex gap-3 items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" width={170} height={36} />
        </Link>
        <div className="flex gap-3 items-center mt-5">
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
                <p className="body-bold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="small-regular text-light-3">@{user.username}</p>
              </>
            )}
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            if (!link) return null;
            const isActive = pathname === link.route;
            const isCreate = link.label === "Create Post";

            return (
              <li key={link.route} className={`leftsidebar-link ${isActive ? "bg-off-white" : ""}`}>
                <div
                  className={isCreate ? `leftsidebar-create ${isActive ? "bg-off-white" : ""}` : ""}
                >
                  <NavLink
                    to={link.route}
                    className={`flex gap-4 items-center p-4 ${isCreate ? "text-md" : ""}`}
                  >
                    {!isCreate && <img src={link.imgURL} alt={link.label} className="h-5 w-5" />}
                    {link.label}
                  </NavLink>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col-reverse">
        <Button
          className="leftsidebar-link bg-off-white hover:bg-red-500 hover:text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
