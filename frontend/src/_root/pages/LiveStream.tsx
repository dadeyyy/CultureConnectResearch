import { useEffect, useState } from 'react';
import VideoCard from '@/components/shared/VideoCard';
// import { io } from 'socket.io-client';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'You cannot create an livestreram without a title.',
  }),
  description: z.string({
    required_error: 'Add a description.',
  }),
});

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
    fullName: string;
    username: string;
  };
  modified: string;
  uid: string;
}[];

const LiveStream = () => {
  const [availableLivestreams, setAvailableLivestreams] = useState<streamState>(
    []
  );
  const [pastLiveStream, setPastLiveStream] = useState<pastLiveStreamTypes>([]);
  const [liveDetails, setLiveDetails] = useState({
    fullName: '',
    username: '',
    title: '',
    description: '',
  });
  const [url, setUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');
  const [videoUID, setVideoUID] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const valuesWithUID = {
      title: values.title,
      description: values.description,
      uid: videoUID,
    };

    console.log(valuesWithUID);

    const response = await fetch('http://localhost:8000/startLiveStream', {
      body: JSON.stringify(valuesWithUID),
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setLiveDetails({
        title: data.meta.name,
        description: data.meta.description,
        fullName: data.meta.fullName,
        username: data.meta.username,
      });
      toast.success('Created LiveStream!');
      return;
    }
    toast.error(`${data.message}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(streamKey)
      .then(() => {
        toast.success('Stream key copied to clipboard');
      })
      .catch((error) => {
        toast.error('Failed to copy stream key to clipboard:');
      });
  };

  const copyToClipboardU = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Url copied to clipboard');
      })
      .catch((error) => {
        toast.error('Failed to copy Url to clipboard:');
      });
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreamData = async () => {
      try {
        const liveStreamResponse = await fetch(
          'http://localhost:8000/getLiveStreams'
        );

        if (!liveStreamResponse.ok) {
          throw new Error('Failed to get livestream data!');
        }

        const data1 = await liveStreamResponse.json();
        setAvailableLivestreams(data1);

        const pastLiveStreamResponse = await fetch(
          'http://localhost:8000/pastLiveStreams'
        );

        if (!pastLiveStreamResponse.ok) {
          throw new Error('No past livestreams');
        }

        const data2 = await pastLiveStreamResponse.json();
        setPastLiveStream(data2);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred.'));
        }
      }
    };

    fetchLiveStreamData();
  }, []);

  useEffect(() => {
    const fetchPastLiveStreamData = async () => {
      try {
        const pastLiveStreamResponse = await fetch(
          'http://localhost:8000/pastLiveStreams'
        );

        if (!pastLiveStreamResponse.ok) {
          throw new Error('No past livestreams');
        }

        const data2 = await pastLiveStreamResponse.json();
        setPastLiveStream(data2);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred.'));
        }
      }
    };

    fetchPastLiveStreamData();
  }, []);

  useEffect(() => {
    const fetchUrlStreamKey = async () => {
      try {
        const getUrlStreamKey = await fetch(
          'http://localhost:8000/getUrlStreamKey',
          {
            credentials: 'include',
          }
        );

        if (!getUrlStreamKey.ok) {
          throw new Error('Error fetching url & streamKey');
        }

        const data: { url: string; streamKey: string; videoUID: string } =
          await getUrlStreamKey.json();
        setUrl(data.url);
        setStreamKey(data.streamKey);
        setVideoUID(data.videoUID);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred.'));
        }
      }
    };

    fetchUrlStreamKey();
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
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  encType="multipart/form-data"
                >
                  <SheetHeader>
                    <SheetTitle>Go Live</SheetTitle>
                    <SheetDescription>Description</SheetDescription>
                  </SheetHeader>
                  <div>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="shad-form_label">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="Enter Title"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="shad-form_message" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="shad-form_label">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="Enter Description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="shad-form_message" />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="url" className="text-base">
                        Url
                      </Label>
                      <div className="flex flex-row">
                        <Input
                          id="url"
                          value={url}
                          className="w-full"
                          readOnly
                        />
                        <Button
                          type="button"
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
                          type="button"
                          onClick={copyToClipboard}
                          className="bg-white hover:bg-blue-200"
                        >
                          <img src="/assets/icons/copy.svg" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Button type="submit" className="w-full">
                        Go Live
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>
        <Carousel className="lg:w-[720px] xl:w-[1080px] m-auto xs:w-[330px]">
          <CarouselContent className="h-full m-auto my-2">
            {availableLivestreams.length === 0 ? (
              <h1 className="text-center w-full">No live stream available</h1>
            ) : (
              availableLivestreams.map((data, index) => (
                <CarouselItem key={index}>
                  <div className="">
                    <Card
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/live-streams/${data.uid}`);
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
                                {data.meta.fullName}
                              </span>
                              <span className="text-md text-start">
                                @{data.meta.username}
                              </span>
                            </span>
                          </span>

                          <span className="text-base font-base text-justify">
                            <h1>
                              <b>Title:{data.meta.name}</b>
                            </h1>
                            <p>{data.meta.description}</p>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex flex-col gap-2 my-5 xl:max-h-2/3 xs:max-h-96 custom-scrollbar">
          <span className="text-xl font-bold px-3 text-center sticky top-0 bg-white opacity-80">
            Past Live Streams
          </span>
          <div className="px-5 pb-2 gap-2 w-full grid xl:grid-cols-3 xs:grid-cols-1">
            {pastLiveStream.map((data, index) => (
              <VideoCard
                key={index}
                title={data.meta.name}
                creator={data.creator}
                dateCreate={data.created}
                thumbnail={data.thumbnail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
