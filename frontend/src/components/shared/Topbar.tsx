import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const { user } = useUserContext();
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/home" className="flex gap-3 items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" width={130} height={325} />
        </Link>
        <div className="flex gap-2">
          <Link to={`/notifications`} className="flex-center gap-3">
            <img
              src={"/assets/icons/notification.svg"}
              alt="profile picture"
              className="h-7 w-7 rounded-full"
            />
          </Link>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile picture"
              className="h-10 w-10 rounded-full"
            />
          </Link>
          <div className="flex-center gap-3">
            <img
              src={"/assets/icons/logout.svg"}
              alt="profile picture"
              className="h-7 w-7 rounded-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
