import VideoCard from "@/components/shared/VideoCard";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    thumbnail:
      "https://static-cse.canva.com/blob/1424409/1600w-wK95f3XNRaM.jpg",
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
    thumbnail:
      "https://miro.medium.com/v2/resize:fit:680/1*n0t58ubvkW8hzqf1trUlMw.jpeg",
  },
];

const LiveStream = () => {
  return (
    <div className="  w-full flex xl:flex-row xs:flex-col">
      <div className="w-full flex flex-col custom-scrollbar overflow-auto">
        <div className="w-fullh-full flex justify-center">
          <Carousel className="w-4/5 m-auto">
            <CarouselContent className="h-full m-auto my-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="">
                    <Card>
                      <CardContent className="flex lg:aspect-[5/3] xs:aspect-[1/2] items-center h-full justify-center rounded-xl gap-3 pr-3">
                        <iframe
                          className="object-cover rounded-xl"
                          width="100%"
                          height="100%"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe>
                        <div className="flex flex-col w-1/2">
                          <span className="flex flex-row text-center items-center gap-4 my-5">
                            <img
                              src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQwiLBJBdBtEKcMeSH__f1L0CdeqX1yyYsq3uF53SLESM0_qkA7QPTCN8TtEuyIpJygRsed"
                              width={75}
                              className="rounded-full"
                            />
                            <span className="flex flex-col">
                              <span className="text-xl font-bold text-center">
                                Rick Astley
                              </span>
                              <span className="text-md text-start">
                                @RickJackson
                              </span>
                            </span>
                          </span>

                          <span className="text-base font-base text-justify">
                            Astley himself has been rickrolled a few times; in
                            fact, the first time he was rickrolled actually
                            pre-dated the viral phenomenon. In an interview with
                            Larry King, Astley stated that the first time he
                            fell for the prank was through an email his friend
                            sent him during the early 2000s.
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="flex flex-col gap-2 my-5 xl:max-h-2/3 xs:max-h-96 custom-scrollbar">
          <span className="text-xl font-bold px-3 text-center sticky top-0 bg-white opacity-80">
            Past Live Streams
          </span>
          <div className="px-5 pb-2 gap-2 w-full grid xl:grid-cols-3 xs:grid-cols-1 ">
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

      {/* <div className="gap-2 bg-white flex flex-col custom-scrollbar overflow-y-auto lg:max-h-screen xs:max-h-96">
        <span className="text-xl font-bold sticky top-0 bg-white opacity-80 text-center">
          Available
        </span>
        <span className="px-7 pb-5 gap-5 flex flex-col-reverse">
          {sources.map((source) => (
            <VideoCard
              title={source.title}
              creator={source.creator}
              views={source.views}
              dateCreate={source.dateCreate}
              thumbnail={source.thumbnail}
            />
          ))}
        </span>
      </div> */}
    </div>
  );
};

export default LiveStream;
