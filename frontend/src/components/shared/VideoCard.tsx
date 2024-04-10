import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VideoCard = () => {
  return (
<div className="flex justify-center items-center cursor-pointer ">
  <div className="w-full min-w-64 max-w-xs">
    <div className="bg-white border rounded-lg shadow-md">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOAh9PP2K3lPsFrrDP9ZmxOLtKZMKJAAHLn1rjRH4iew&s"
        className="w-full h-full aspect-video object-cover"
        alt="Dog"
      />
      <div className="py-2 px-4 flex flex-col">
        <span className="text-lg font-bold">I recreated the gagamboy</span>
        <span>MrBeast</span>
        <span className="text-xs">110 views 4 hours ago</span>
      </div>
    </div>
  </div>
</div>

  );
};

export default VideoCard;
