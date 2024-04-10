import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// type streamState = {
//   name: string;
//   uid: string;
// }[];

const LiveStream = () => {
  const [availableLivestreams, setAvailableLivestreams] = useState<streamState>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/getLiveStreams');

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // setAvailableLivestreams(data);
        } else {
          console.log('Error Fetching Data', response.statusText);
        }
      } catch (error) {
        console.log('Error Fetching Data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>


      
    </div>
  );
};

export default LiveStream;
