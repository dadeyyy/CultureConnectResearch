import { Link, NavLink, useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const { pathname } = useLocation();

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
      imgURL: "/assets/icons/saved.svg",
      route: "/saved",
      label: "Saved",
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

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-7">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" width={170} height={36} />
        </Link>
        <ul className="flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            const isCreate = link.label === "Create Post";
            return (
              <li key={link.route} className={`leftsidebar-link ${isActive ? "bg-off-white" : ""}`}>
                <div className={isCreate ? "leftsidebar-create" : ""}>
                  <NavLink
                    to={link.route}
                    className={`flex gap-4 items-center p-4 ${isCreate && "text-lg"}`}
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
        <Link to={"/profile/{user.id}"} className="flex gap-3 items-center">
          <img
            src={"/assets/icons/profile-placeholder.svg"}
            alt="profile picture"
            className="h-12 w-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">Profile</p>
            <p className="small-regular text-light-3">@username</p>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default LeftSidebar;
