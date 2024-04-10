import VideoCard from "@/components/shared/VideoCard";

const LiveStream = () => {
  return (
    <div className=" bg-red-200 w-full flex">
      <div className="w-full flex flex-col">
        <div className="w-full bg-red-300 h-2/3">adss</div>
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold">Trending: </span>
          <div className="px-2 gap-2 flex w-2/3 overflow-auto">
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
            <VideoCard />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default LiveStream;
