import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  if (user.role === "USER") {
    return (
      <div className="bg-red-200 w-full overflow-auto text-center grid justify-items-center items-center">
        <div className="text-2xl font-bold flex flex-col items-center">
          <span>You are not authorized to open this.</span>
          <Button
            className="w-1/2 hover:bg-red-400 hover:text-white"
            onClick={() => {
              navigate(-1);
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-200 w-full overflow-auto">
      <div className="bg-red-300 w-full h-16 text-center p-3 sticky">
        <span className="text-xl font-bold">Reported Posts</span>
      </div>
      <div className="grid grid-cols-2 h-full">
        <div className="bg-blue-500 w-full h-full">ey</div>
        <div className="bg-red-500 w-full h-full">ey</div>
      </div>
    </div>
  );
};

export default Reports;
