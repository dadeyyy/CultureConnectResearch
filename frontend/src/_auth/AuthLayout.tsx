import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  const location = useLocation();
  const [image, setImage] = useState("");

  useEffect(() => {
    // Set the image source based on the current route
    if (location.pathname === "/signin") {
      setImage("/assets/images/Philippines.svg");
    } else if (location.pathname === "/signup") {
      setImage("/assets/images/Philippine-flag.svg");
    }
  }, [location.pathname]);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <div className="hidden xl:block h-screen w-1/2 object-cover">
            {image && <img src={image} alt="logo" className="pl-20 h-screen bg-no-repeat" />}
          </div>
          <section className="flex flex-1 justify-center items-center flex-col py-10 m-auto">
            <Outlet />
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
