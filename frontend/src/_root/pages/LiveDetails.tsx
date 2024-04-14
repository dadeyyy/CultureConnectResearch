import VideoCard from "@/components/shared/VideoCard";
import { Button } from "@/components/ui/button";
// import { io } from 'socket.io-client';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { filterInappropriateWords } from "@/lib/CaptionFilter";

const sources = [
  {
    title: "I am a demon",
    creator: "MrBeast",
    views: "110 Million",
    dateCreate: "24 hours ago",
    thumbnail:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e0846834-6d3f-48bf-89a4-b80cd5803824/dfou32q-a8d70115-4924-4a1e-b0ec-682db24cb813.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UwODQ2ODM0LTZkM2YtNDhiZi04OWE0LWI4MGNkNTgwMzgyNFwvZGZvdTMycS1hOGQ3MDExNS00OTI0LTRhMWUtYjBlYy02ODJkYjI0Y2I4MTMuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.wAbbuTHUjT0CuD4NZL82zmOLhN3sx3nxNtb4aeXxdkk",
  },
  {
    title: "Unang araw palang minahal na kita",
    creator: "Gloco",
    views: "110",
    dateCreate: "4 hours ago",
    thumbnail:
      "https://scontent.fsfs1-1.fna.fbcdn.net/v/t1.6435-9/50428424_1284288608376759_5096522740211384320_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGYi7YuMZqxlazw7y6FCx-y3t5DaPKM9RTe3kNo8oz1FOVHNi3VtRAI3t_GBTCTVBI&_nc_ohc=FUdTBvo4764Ab5B1UMH&_nc_ht=scontent.fsfs1-1.fna&oh=00_AfA7lo_UYZT_-603OxKTVVjYgndLF7iD4oEcXPJFt7raXw&oe=663E56A0",
  },
  {
    title: "Wow grape",
    creator: "IndianNigka",
    views: "9",
    dateCreate: "4 hours ago",
    thumbnail: "https://i.ytimg.com/vi/FFZSgalRSQQ/maxresdefault.jpg",
  },
  {
    title: "Cheese Club",
    creator: "YawningBastard",
    views: "69",
    dateCreate: "23 hours ago",
    thumbnail: "https://static-cse.canva.com/blob/1424409/1600w-wK95f3XNRaM.jpg",
  },
  {
    title: "Spiderman ey",
    creator: "ChewingGum",
    views: "690",
    dateCreate: "7 hours ago",
    thumbnail:
      "https://marketplace.canva.com/EAFW7JwIojo/2/0/1600w/canva-red-colorful-tips-youtube-thumbnail-FxVVsqyawqY.jpg",
  },
  {
    title: "Eye Catching Youtube Thumbnail",
    creator: "GirlFromNowhere",
    views: "2 days ago",
    dateCreate: "21 hours ago",
    thumbnail: "https://miro.medium.com/v2/resize:fit:680/1*n0t58ubvkW8hzqf1trUlMw.jpeg",
  },
];

const dummyData = [
  {
    id: 1,
    username: "@juan",
    message: "Hey guys, how's it going?",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:00:00Z",
    userId: 1,
  },
  {
    id: 2,
    username: "@pedro",
    message: "Not bad, just chilling.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:05:00Z",
    userId: 2,
  },
  {
    id: 3,
    username: "@balimbing",
    message: "I'm doing great, thanks!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:10:00Z",
    userId: 3,
  },
  {
    id: 4,
    username: "@pakman",
    message: "Anyone up for a game later?",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:15:00Z",
    userId: 4,
  },
  {
    id: 5,
    username: "@tipaklong",
    message: "Sure, I'm in for a game!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:20:00Z",
    userId: 5,
  },
  {
    id: 6,
    username: "@juan",
    message: "Awesome, let's meet at 8 PM.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:25:00Z",
    userId: 1,
  },
  {
    id: 7,
    username: "@pedro",
    message: "Sounds good to me.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:30:00Z",
    userId: 2,
  },
  {
    id: 8,
    username: "@balimbing",
    message: "Count me in as well.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:35:00Z",
    userId: 3,
  },
  {
    id: 9,
    username: "@pakman",
    message: "Great! We just need @tipaklong to confirm.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:40:00Z",
    userId: 4,
  },
  {
    id: 10,
    username: "@tipaklong",
    message: "I'm confirmed, see you all at 8 PM.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:45:00Z",
    userId: 5,
  },
  {
    id: 11,
    username: "@juan",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 1,
  },
  {
    id: 12,
    username: "@juan",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 1,
  },
  {
    id: 13,
    username: "@tipaklong",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 5,
  },
  {
    id: 14,
    username: "@pedro",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 2,
  },
  {
    id: 15,
    username: "@tipaklong",
    message: "I'm confirmed, see you all at 8 PM.",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:45:00Z",
    userId: 5,
  },
  {
    id: 16,
    username: "@juan",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 1,
  },
  {
    id: 17,
    username: "@juan",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 1,
  },
  {
    id: 18,
    username: "@tipaklong",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 5,
  },
  {
    id: 19,
    username: "@pedro",
    message: "Awesome, looking forward to it!",
    profilePicture: "/assets/icons/profile-placeholder.svg",
    timestamp: "2024-04-10T10:50:00Z",
    userId: 2,
  },
];

const colors = [
  "#FF0000",
  "#0000FF",
  "#008000",
  "#FFFF00",
  "#800080",
  "#FFA500",
  "#FFC0CB",
  "#40E0D0",
  "#A52A2A",
  "#FFD700",
  "#C0C0C0",
  "#00FFFF",
  "#FF00FF",
  "#00FF00",
  "#4B0082",
];

const idColor = (id: number) => {
  const remainder = id % 15;
  const color = colors[remainder];
  return color;
};

const LiveDetails = () => {
  return (
    <div className="w-full flex xl:flex-row xs:flex-col">
      <div className="w-full custom-scrollbar overflow-auto">
        <div className="h-full w-full">
          <div className="flex lg:flex-row xs:flex-col h-full">
            <div className="overflow-y-auto custom-scrollbar">
              <iframe
                className="object-cover aspect-video w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              <div className="p-2">
                <Card className="flex flex-col w-full p-2">
                  <span className="flex flex-row text-center items-center gap-4 my-3">
                    <img
                      src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQwiLBJBdBtEKcMeSH__f1L0CdeqX1yyYsq3uF53SLESM0_qkA7QPTCN8TtEuyIpJygRsed"
                      width={75}
                      className="rounded-full"
                    />
                    <span className="flex flex-col">
                      <span className="text-xl font-bold text-center">Rick Astley</span>
                      <span className="text-md text-start">@RickJackson</span>
                    </span>
                  </span>

                  <span className="text-base font-base text-justify">
                    Astley himself has been rickrolled a few times; in fact, the first time he was
                    rickrolled actually pre-dated the viral phenomenon. In an interview with Larry
                    King, Astley stated that the first time he fell for the prank was through an
                    email his friend sent him during the early 2000s.
                  </span>
                </Card>
              </div>
              <div className="flex flex-col gap-2 my-5 xl:max-h-2/3 xs:max-h-96 custom-scrollbar">
                <span className="text-xl font-bold px-3 text-center sticky top-0 bg-white opacity-80">
                  More Live Streams
                </span>
                <div className="px-5 pb-2 gap-2 w-full grid xl:grid-cols-2 xs:grid-cols-1">
                  {sources.map((source) => (
                    <VideoCard
                      title={source.title}
                      creator={source.creator}
                      views={source.views}
                      dateCreate={source.dateCreate}
                      thumbnail={source.thumbnail}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="min-w-[360px] h-full border border-transparent border-l-gray-500 text-center flex flex-col justify-between">
              <div className=" h-full">
                <div className="p-3 w-full text-lg">Stream Chat</div>
                <hr className="border w-full border-gray-500" />
                <div className="p-2 flex flex-col gap-2 overflow-auto max-h-[600px] custom-scrollbar">
                  {dummyData.map((source) => (
                    <div className="text-dark-1 flex flex-row gap-2 ">
                      <img
                        src={"/assets/icons/profile-placeholder.svg"}
                        alt="profile picture"
                        className="h-6 w-6 rounded-full bg-cover"
                      />
                      <div className="flex-row flex items-center gap-2">
                        <span
                          className={`font-bold text-base`}
                          style={{ color: idColor(source.userId) }}
                        >
                          {source.username}{" "}
                        </span>
                        <span className="text-sm text-start">
                          {filterInappropriateWords(source.message)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full bg-red-200 gap-2 p-2 flex-col items-end">
                <hr className="border w-full border-gray-500" />
                <Input className="w-full" />
                <Button className="w-1/2">Send Chat</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetails;
