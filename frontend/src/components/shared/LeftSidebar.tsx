import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import toast from 'react-hot-toast';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, isLoading, checkAuthUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user.id) {
        await checkAuthUser();
      }
    };
    fetchData();
  }, [checkAuthUser, user.id]);

  const options = [
    { label: "Profile", value: "profile" },
    { label: "Logout", value: "logout" },
  ];

  const sidebarLinks = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/home",
      label: "Home",
    },
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
      imgURL: "/assets/icons/notification.svg",
      route: "/notifications",
      label: "Notifications",
    },
    {
      route: "/create-post",
      label: "Create Post",
    },
  ];

  const handleOptionSelect = async (selectedValue: string) => {
    setOpen(false);
    setValue(selectedValue);

    if (selectedValue === "logout") {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      localStorage.removeItem("currentUser");

      return navigate("/");
    } else if (selectedValue === "profile") {
      window.location.href = `/profile/${user.id}`;
    }
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-7">
        <Link to="/home" className="flex gap-3 items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" width={170} height={36} />
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            const isCreate = link.label === "Create Post";

            return (
              <li key={link.route} className={`leftsidebar-link ${isActive ? "bg-off-white" : ""}`}>
                <div
                  className={isCreate ? `leftsidebar-create ${isActive ? "bg-off-white" : ""}` : ""}
                >
                  <NavLink
                    to={link.route}
                    className={`flex gap-4 items-center p-4 ${isCreate ? "text-lg" : ""}`}
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
        <div className="flex gap-3 items-center">
          <img
            src={
              isLoading
                ? "/assets/icons/profile-placeholder.svg"
                : user.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile picture"
            className="h-12 w-12 rounded-full bg-cover"
          />
          <div className="flex flex-col">
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
          <div className="flex flex-col">
            <div className="grid grid-cols-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <img
                    src={"/assets/icons/three-dots.svg"}
                    alt="profile picture"
                    className="h-5 w-5 rounded-full col-end-7 hover:opacity-70 transition-opacity"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-light-2" side="top" align="end">
                  <Command>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={handleOptionSelect}
                          className="hover:bg-primary-1 cursor-pointer transition-colors"
                        >
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LeftSidebar;
