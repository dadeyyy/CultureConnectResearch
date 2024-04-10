import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

type streamState = {
  name: string;
  uid: string;
}[];

const LiveStream = () => {
  // const [availableLivestreams, setAvailableLivestreams] = useState<streamState>([]);
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
      {/* <h1>{availableLivestreams[0].name}</h1>
      <h1>{availableLivestreams[0].uid}</h1> */}
      {/* <h1>Test</h1>
      <ul>
        {availableLivestreams.map((livestream, index) => (
          <li key={index}>
            <h1>{livestream.name}</h1>
            <h2>{livestream.uid}</h2>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default LiveStream;
