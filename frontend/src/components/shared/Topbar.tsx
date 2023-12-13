import { Link } from "react-router-dom";

const Topbar = () => {
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/home" className="flex gap-3 items-center">
          <img src="/assets/images/logo-2.svg" alt="logo" width={130} height={325} />
        </Link>
        <div className="flex">
          <Link to={"/profile/$user.id"} className="flex-center gap-3">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile picture"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
