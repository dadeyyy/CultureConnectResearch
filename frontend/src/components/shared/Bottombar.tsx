import React from "react";

const Bottombar = () => {
  const bottombarLinks = [
    {
      imgURL: "/assets/icons/home.svg",
      route: "/",
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

  return <div>Bottombar</div>;
};

export default Bottombar;
