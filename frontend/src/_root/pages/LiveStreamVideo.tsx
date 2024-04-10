import { useEffect } from 'react';
import { io } from 'socket.io-client';

type liveStreamProps = {
  liveStreamId: number;
  username: string;
};

const LiveStreamVideo = ({ liveStreamId, username }: liveStreamProps) => {
  useEffect(() => {
    const socket = io('http://localhost:8000');

    //Join the livestream
    socket.emit('joinLivestream', liveStreamId, username);

    socket.on('userJoined', (joinedUsername) => {
      console.log(`${joinedUsername} joined the livestream`);
      //UPDATE THE UI
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [liveStreamId, username]);
  return <div>LiveStreamVideo</div>;
};

export default LiveStreamVideo;
