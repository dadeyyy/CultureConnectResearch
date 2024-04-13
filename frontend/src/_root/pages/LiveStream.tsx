import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

type LiveStreamState = {
  created: string;
  deleteRecordingAfterDays: number;
  meta: {
    name: string;
  };
  modified: string;
  uid: string;
}[]

const LiveStream = () => {
  const [availableLivestreams, setAvailableLivestreams] = useState<LiveStreamState>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/getLiveStreams');

        if (response.ok) {
          const data = await response.json();
          console.log('DATA', data);
          setAvailableLivestreams(data);
        } else {
          console.log('Error Fetching Data', response.statusText);
        }
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    };

    fetchData();
  }, []);


  if (availableLivestreams.length !== 0) {
    return (
      <div>
        {availableLivestreams.map((data,index)=> {
          return <iframe
          key={index}
          src={`https://customer-zo8okz8uxe6umby3.cloudflarestream.com/${data.uid}/iframe`}
          title="Example Stream video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        })}
      </div>
    );
  }

  return <h1>No livestream available</h1>;
};

export default LiveStream;
