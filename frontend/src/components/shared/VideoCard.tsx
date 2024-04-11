type videoCardProps = {
  title: String,
  creator: String,
  views: String,
  dateCreate: String,
  thumbnail: String,
}

const VideoCard = ({title, creator, views, dateCreate, thumbnail}: videoCardProps) => {
  
  return (
<div className="flex justify-center items-center cursor-pointer ">
  <div className="w-full min-w-64 max-w-96">
    <div className="bg-white border rounded-lg shadow-md">
      <img
        src={`${thumbnail}`}
        className="w-full h-full aspect-video object-cover rounded-t-lg"
        alt="Dog"
      />
      <div className="py-2 px-4 flex flex-col">
        <span className="text-sm font-bold">{title}</span>
        <span className="text-sm">{creator}</span>
        <span className="text-xs">{views} views {" "} {dateCreate}</span>
      </div>
    </div>
  </div>
</div>

  );
};

export default VideoCard;
