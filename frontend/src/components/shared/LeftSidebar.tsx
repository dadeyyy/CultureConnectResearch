import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, checkAuthUser } = useUserContext();

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
    // {
    //   imgURL: "/assets/icons/for-you.svg",
    //   route: "/for-you",
    //   label: "For You",
    // },

    {
      imgURL: "/assets/icons/explore.svg",
      route: "/Explore",
      label: "Explore",
    },
    user.role === "ADMIN"
      ? {
          imgURL: "/assets/icons/reports.svg",
          route: "/reports",
          label: "Reports",
        }
      : null,
    {
      imgURL: "/assets/icons/archive-icon.svg",
      route: "/archives",
      label: "Archives",
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
      imgURL: `${user.imageUrl}`,
      route: `/profile/${user.id}`,
      label: "Profile",
    },
    {
      route: "/create-post",
      label: "Create Post",
    },
  ].filter(Boolean);

  console.log(user.imageUrl);
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
      <Link to="/home" className="flex gap-3 items-center my-5 mx-2 ">
        <img src="/assets/images/logo-2.svg" alt="logo" width={170} height={36} />
      </Link>
      <div className="flex flex-col gap-7 h-full py-5">
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
                    className={`flex gap-4 items-center ${
                      link.label === "Profile" ? "p-2" : "p-3"
                    } ${isCreate ? "text-sm" : ""}`}
                  >
                    {!isCreate && (
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className={`h-5 w-5 ${
                          link.label === "Profile" ? "h-7 w-7 rounded-full" : ""
                        }`}
                      />
                    )}
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
