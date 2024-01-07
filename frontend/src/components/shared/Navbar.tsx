import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="flex justify-between items-center h-24 w-screen mx-auto px-20 text-black">
      <img src="/assets/images/logo.svg" width={50} height={50} />
      <ul className="hidden md:flex items-center">
        <li className="p-4">Home</li>
        <li className="p-4">Features</li>
        <li className="p-4">Who we are</li>
        <li className="p-4">About</li>
        <li className="p-4">Contact</li>
        <li>
          <Link to="/signin" className="leftsidebar-create rounded-md font-medium py-3 px-6 ">
            Sign in
          </Link>
        </li>
      </ul>

      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-white ease-in-out duration-500"
            : "ease-in-out duration-500 fixed left-[-100%]"
        }
      >
        <img src="/assets/images/logo-2.svg" width={200} height={50} className="py-5" />
        <li className="p-4 border-b border-gray-600">Home</li>
        <li className="p-4 border-b border-gray-600">Features</li>
        <li className="p-4 border-b border-gray-600">Who we are</li>
        <li className="p-4 border-b border-gray-600">About</li>
        <li className="p-4 border-b border-gray-600">Contact</li>
        <li>
          <Link
            to="/signin"
            className="leftsidebar-create w-[100px] rounded-md font-medium my-6 mx-auto py-3"
          >
            Sign in
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
