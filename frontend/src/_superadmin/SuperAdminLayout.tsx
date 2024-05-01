import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sidebarLinks = [
    {
      route: "/superadmin",
      label: "Admin Creation",
    },
    {
      route: "/admins",
      label: "Admins",
    },
  ];

  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    localStorage.removeItem("currentUserId");

    return navigate("/");
  };

  return (
    <div className="w-full md:flex">
      <div className="w-full flex justify-center">
        <nav className="leftsidebar sticky border border-r-gray-300 items-center">
          <Link to="/home" className="flex gap-3 items-center my-5 mx-2 ">
            <img src="/assets/images/logo-2.svg" alt="logo" width={170} height={36} />
          </Link>
          <div className="flex flex-col gap-7 h-full py-5">
            <ul className="flex flex-col gap-1">
              {sidebarLinks.map((link) => {
                if (!link) return null;
                const isActive = pathname === link.route;

                return (
                  <li
                    key={link.route}
                    className={`leftsidebar-link ${isActive ? "bg-off-white" : ""}`}
                  >
                    <NavLink to={link.route} className={`flex gap-4 items-center p-3`}>
                      {link.label}
                    </NavLink>
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
        <div className="border w-[720px]">
          <section className="flex flex-1 h-full">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
