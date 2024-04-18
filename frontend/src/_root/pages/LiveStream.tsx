import { useEffect, useState } from "react";
import VideoCard from "@/components/shared/VideoCard";
// import { io } from 'socket.io-client';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import toast from "react-hot-toast";

export type pastLiveStreamTypes = {
  uid: string;
  creator: string;
  thumbnail: string;
  thumbnailTimestampPct: number;
  readyToStream: boolean;
  readyToStreamAt: string;
  status: {
    state: string;
    pctComplete: string;
    errorReasonCode: string;
    errorReasonText: string;
  };
  meta: {
    name: string;
  };
  created: string;
  modified: string;
  scheduledDeletion: unknown;
  size: number;
  preview: string;
  allowedOrigins: string[];
  requireSignedURLs: boolean;
  uploaded: string;
  uploadExpiry: unknown;
  maxSizeBytes: number | null;
  maxDurationSeconds: number | null;
  duration: number;
  input: {
    width: number;
    height: number;
  };
  playback: {
    hls: string;
    dash: string;
  };
  watermark: unknown;
  liveInput: string;
  clippedFrom: unknown;
  publicDetails: {
    title: string | null;
    share_link: string | null;
    channel_link: string | null;
    logo: string | null;
  };
}[];

// export type pastLiveStreamApiResponse = {
//   result: pastLiveStreamTypes[];
//   success: boolean;
//   errors: unknown[];
//   messages: unknown[];
// };

type streamState = {
  created: string;
  deleteRecordingAfterDays: number;
  meta: {
    name: string;
    description: string;
  };
  modified: string;
  uid: string;
}[];

const LiveStream = () => {
  const [availableLivestreams, setAvailableLivestreams] = useState<streamState>(
    []
  );
  const [pastLiveStream, setPastLiveStream] = useState<pastLiveStreamTypes>([]);

  const [streamKey, setStreamKey] = useState("andreiodsa");
  const [url, setUrl] = useState("lazcikashjdkashjdsa");

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(streamKey)
      .then(() => {
        toast.success("Stream key copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy stream key to clipboard:");
      });
  };

  const copyToClipboardU = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success("Url copied to clipboard");
      })
      .catch((error) => {
        toast.error("Failed to copy Url to clipboard:");
      });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreamData = async () => {
      try {
        const liveStreamResponse = await fetch(
          "http://localhost:8000/getLiveStreams"
        );

        if (!liveStreamResponse.ok) {
          throw new Error("Failed to get livestream data!");
        }

        const data1 = await liveStreamResponse.json();
        setAvailableLivestreams(data1);

        const pastLiveStreamResponse = await fetch(
          "http://localhost:8000/pastLiveStreams"
        );

        if (!pastLiveStreamResponse.ok) {
          throw new Error("No past livestreams");
        }

        const data2 = await pastLiveStreamResponse.json();
        setPastLiveStream(data2);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred."));
        }
      }
    };

    fetchLiveStreamData();
  }, []);

  useEffect(() => {
    const fetchPastLiveStreamData = async () => {
      try {
        const pastLiveStreamResponse = await fetch(
          "http://localhost:8000/pastLiveStreams"
        );

        if (!pastLiveStreamResponse.ok) {
          throw new Error("No past livestreams");
        }

        const data2 = await pastLiveStreamResponse.json();
        setPastLiveStream(data2);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred."));
        }
      }
    };

    fetchPastLiveStreamData();
  }, []);

  return (
    <div className="w-full flex xl:flex-row xs:flex-col">
      <div className="w-full flex flex-col custom-scrollbar overflow-auto">
        <div className="bg-red-200 w-full p-3 flex flex-row justify-between text-center items-center px-5">
          <div className="text-lg font-bold decoration-indigo-500">
            CultureConnect Live streams
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-red-500">Go Live</Button>
            </SheetTrigger>
            <SheetContent className="min-w-[720px]">
              <SheetHeader>
                <SheetTitle>Go Live</SheetTitle>
                <SheetDescription>Description</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex  flex-col gap-2">
                  <Label htmlFor="title" className="text-base">
                    Caption
                  </Label>
                  <Input id="name" value="Input Caption" className="w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-base">
                    Description (optional)
                  </Label>
                  <Input id="name" value="Pedro Duarte" className="w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="url" className="text-base">
                    Url
                  </Label>
                  <div className="flex flex-row">
                    <Input id="url" value={url} className="w-full" readOnly />
                    <Button
                      onClick={copyToClipboardU}
                      className="bg-white hover:bg-blue-200"
                    >
                      <img src="/assets/icons/copy.svg" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="streamkey" className="text-base">
                    Streamkey
                  </Label>
                  <div className="flex flex-row">
                    <Input
                      id="streamkey"
                      value={streamKey}
                      className="w-full"
                      readOnly
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="bg-white hover:bg-blue-200"
                    >
                      <img src="/assets/icons/copy.svg" />
                    </Button>
                  </div>
                </div>
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/Aa0IFks-nAE?si=Kzmxaq0PnN08Urn2"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>

              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" className="w-full">
                    Go Live
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <Carousel className="lg:w-[720px] xl:w-[1080px] m-auto xs:w-[330px]">
          <CarouselContent className="h-full m-auto my-2">
            {availableLivestreams.map((data, index) => (
              <CarouselItem key={index}>
                <div className="">
                  <Card
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/live-streams/1`);
                    }}
                  >
                    <CardContent className="flex lg:flex-row xs:flex-col items-center justify-center rounded-xl p-0 pr-2 border-2 gap-3">
                      <iframe
                        className="object-cover aspect-video w-full rounded-l-xl"
                        key={index}
                        src={`https://customer-zo8okz8uxe6umby3.cloudflarestream.com/${data.uid}/iframe`}
                        title="Example Stream video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
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
                          <h1>
                            <b>{data.meta.name}</b>
                          </h1>
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
        <div className="flex flex-col gap-2 my-5 xl:max-h-2/3 xs:max-h-96 custom-scrollbar">
          <span className="text-xl font-bold px-3 text-center sticky top-0 bg-white opacity-80">
            Past Live Streams
          </span>
          <div className="px-5 pb-2 gap-2 w-full grid xl:grid-cols-3 xs:grid-cols-1">
            {pastLiveStream.map((source, index) => (
              <VideoCard
                key={index}
                title={source.meta.name}
                creator={source.creator}
                dateCreate={source.created}
                thumbnail={source.thumbnail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
