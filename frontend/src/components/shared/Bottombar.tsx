import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();

  const bottombarLinks = [
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
      imgURL: "/assets/icons/create.svg",
      route: "/create-post",
      label: "Post",
    },
  ];

  return (
    <section className="bottom-bar">
      {" "}
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        const isCreate = link.label === "Post";
        return (
          <div key={link.route} className={isCreate ? "bg-primary-1 rounded-[10px] p-2" : ""}>
            <Link
              to={link.route}
              className={`${
                isActive
                  ? `rounded-[10px] flex-center flex-col gap-1 ${
                      !isCreate ? "bg-off-white p-2" : ""
                    }`
                  : ""
              } `}
            >
              <img src={link.imgURL} alt={link.label} className={"h-5 w-5"} />
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default Bottombar;
