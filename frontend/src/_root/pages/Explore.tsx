const Explore = () => {
  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="home-container bg-red-200">
        <div className="w-full flex flex-col items-center relative">
          <div className="explore-header h-20"></div>
        </div>
      </div>
      <div className="home-creators">
        <span className="text-sm">
          <span className="hover:underline cursor-pointer m-1">Terms of Service</span>
          <span className="hover:underline cursor-pointer m-1">Privacy Policy</span>
          <span className="hover:underline cursor-pointer m-1"> About</span>
          <div>
            <span className="m-1">© 2024 CultureConnect.</span>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Explore;
