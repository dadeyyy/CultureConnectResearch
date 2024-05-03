import VideoCard from '@/components/shared/VideoCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import { filterInappropriateWords } from '@/lib/CaptionFilter';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pastLiveStreamTypes } from '@/lib/livestream/liveStreamTypes';
import { io } from 'socket.io-client';
import { formatDateString, multiFormatDateString } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const colors = [
  '#FF0000',
  '#0000FF',
  '#008000',
  '#FFFF00',
  '#800080',
  '#FFA500',
  '#FFC0CB',
  '#40E0D0',
  '#A52A2A',
  '#FFD700',
  '#C0C0C0',
  '#00FFFF',
  '#FF00FF',
  '#00FF00',
  '#4B0082',
];

const idColor = (id: number) => {
  const remainder = id % 15;
  const color = colors[remainder];
  return color;
};

const socket = io('http://localhost:8000');
type commentResponse = {
  id: number;
  content: string;
  username: string;
  userId: number;
  liveStreamId: string;
  createdAt: string;
  updatedAt: string;
};

type Comment = {
  username: string;
  message: string;
  timeStamp: string;
};
const server ='http://localhost:8000'
const LiveDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const [liveDetails, setLiveDetails] = useState({
    username: '',
    fullName: '',
    title: '',
    description: '',
    createdAt: '',
  });
  const [message, setMessage] = useState('');
  const [liveChats, setLiveChats] = useState<Comment[]>([]);
  const [availableLiveStreams, setAvailableLiveStreams] =
    useState<pastLiveStreamTypes>([]);
  const [isPastLiveStream, setIsPastLiveStream] = useState(false);
  useEffect(() => {
    //Join room
    socket.emit('joinRoom', user.username, id, user.id);

    //message from server
    socket.on('message', (message: Comment) => {
      setLiveChats((prevChats) => {
        return [...prevChats, message];
      });
    });

    // Listens for the socket when user joins

    const fetchOngoingLiveStream = async () => {
      const live = await fetch(`${server}/livestream/${id}`, {
        credentials: 'include',
      });
      const liveData = await live.json();

      if (live.ok) {
        // Sends to the server that a user joins the livestream

        if (liveData.status.state === 'ready') {
          setIsPastLiveStream(true);
          socket.disconnect();
        }
        const { meta } = liveData;
        setLiveDetails({
          username: meta.username,
          fullName: meta.fullName,
          title: meta.title,
          description: meta.description,
          createdAt: liveData.created,
        });
      }
    };

    fetchOngoingLiveStream();

    return () => {
      socket.off('message');
    };
  }, [id, user.username, user.id]);

  //Fetch all the livestream inprogress or past without the current selectedLivestream
  useEffect(() => {
    const lives = async () => {
      const fetchLiveStream = await fetch(
        `${server}/fetchLiveStreams/${id}`,
        {
          credentials: 'include',
        }
      );

      if (!fetchLiveStream.ok) {
        throw new Error('Failed to get livestream data!');
      }
      const fetchLiveStreamData = await fetchLiveStream.json();
      setAvailableLiveStreams(fetchLiveStreamData);
    };

    lives();
  }, [id]);

  useEffect(() => {
    const fetchLiveStreamComments = async () => {
      const comments = await fetch(
        `${server}/liveStream/${id}/comments`,
        {
          credentials: 'include',
        }
      );
      const commentsData = (await comments.json()) as commentResponse[];
      const formattedComments = commentsData.map((comment) => ({
        username: comment.username,
        message: comment.content,
        timeStamp: comment.createdAt,
      }));
      setLiveChats(formattedComments);
    };
    fetchLiveStreamComments();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent form submission
    socket.emit('chatMessage', user.username, message, id, user.id);
    setMessage('');
  };

  return (
    <div className="w-full flex xl:flex-row xs:flex-col">
      <div className="w-full custom-scrollbar overflow-auto">
        <div className="h-full w-full">
          <div className="flex lg:flex-row xs:flex-col h-full">
            <div className="overflow-y-auto custom-scrollbar">
              <iframe
                className="object-cover aspect-video w-full rounded-l-xl"
                src={`https://customer-zo8okz8uxe6umby3.cloudflarestream.com/${id}/iframe`}
                title="Example Stream video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="p-2">
                <Card className="flex flex-col w-full p-2 ">
                  <span className="flex flex-row text-center items-center gap-4 my-3">
                    <Avatar>
                      {/* <AvatarImage
                                src={userProfile.imageUrl}
                                alt={`profile-pictre`}
                              /> */}
                      <AvatarFallback>
                        {liveDetails.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col">
                      <span className="text-xl font-bold text-center">
                        {liveDetails.fullName}
                      </span>
                      <span className="text-md text-start">
                        @{liveDetails.username}
                      </span>
                    </span>
                  </span>
                  <h1>
                    <b>{liveDetails.title}</b>
                  </h1>
                  <span className="text-base font-base text-justify">
                    {liveDetails.description}
                  </span>
                </Card>
              </div>
              <div className="flex flex-col gap-2 my-5 xl:max-h-2/3 xs:max-h-96 custom-scrollbar">
                <span className="text-xl font-bold px-3 text-center sticky top-0 bg-white opacity-80">
                  More Live Streams
                </span>
                <div className="px-5 pb-2 gap-2 w-full grid xl:grid-cols-2 xs:grid-cols-1">
                  {availableLiveStreams.map((data, index) => (
                    <a key={index} href={`/live-streams/${data.uid}`}>
                      <VideoCard
                        title={data.meta.name}
                        creator={data.creator}
                        dateCreate={formatDateString(data.created)}
                        thumbnail={data.thumbnail}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="min-w-[360px] h-full border border-transparent border-l-gray-500 text-center flex flex-col justify-between">
              <div className=" h-full">
                <div className="p-3 w-full text-lg">Stream Chat</div>
                <hr className="border w-full border-gray-500" />
                <div className="p-2 flex flex-col gap-2 overflow-auto max-h-[600px] custom-scrollbar">
                  {liveChats.map((data, index) => (
                    <div
                      key={index}
                      className="text-dark-1 flex flex-row gap-2 "
                    >
                      <img
                        src={'/assets/icons/profile-placeholder.svg'}
                        alt="profile picture"
                        className="h-6 w-6 rounded-full bg-cover"
                      />
                      <div className="flex-row flex items-center gap-2">
                        <span
                          className={`font-bold text-base`}
                          style={{ color: idColor(0) }}
                        >
                          {data.username}{' '}
                        </span>
                        <span className="text-sm font-light text-start">
                          <b>{filterInappropriateWords(data.message)}</b>
                        </span>

                        <p className="text-xs ">
                          {multiFormatDateString(data.timeStamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full bg-red-200 gap-2 p-2 flex-col items-end">
                <hr className="border w-full border-gray-500" />
                <form onSubmit={handleSubmit} className="w-full">
                  <Input
                    className="w-full"
                    value={message}
                    onChange={handleChange}
                    disabled={isPastLiveStream}
                  />
                  <Button
                    disabled={isPastLiveStream}
                    type="submit"
                    className="w-1/2"
                  >
                    Send Chat
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDetails;
