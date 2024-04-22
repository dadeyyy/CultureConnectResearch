// import { useEffect } from 'react';
// import { io } from 'socket.io-client';

// type liveStreamProps = {
//   liveStreamId: string;
//   username: string;
// };

// const LiveStreamVideo = ({ liveStreamId, username }: liveStreamProps) => {

//   //The first time user gets to the specific livestream
//   useEffect(() => {
//     const socket = io('http://localhost:8000');

//     //Join the livestream
//     socket.emit('joinLivestream', liveStreamId, username);
    

//     socket.on('userJoined', (joinedUsername) => {
//       console.log(`${joinedUsername} joined the livestream`);
//       //UPDATE THE UI
//     });


//     //Sample event listener for sending message
//     // form.addEventListener('submit', (e)=>{
//     //   e.preventDefault();
//     //   if(input.value) {
//     //     socket.emit('comment', input.value, username, liveStreamId);
//     //     input.value = ''
//     //   }
//     // })

//     //Display comment
//     // socket.on('display comment', (message, username)=>{
//       // UPDATE THE UI TO DISPLAY THE MESSAGE WITH THE USERNAME
//     // })



//     // Clean up on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, [liveStreamId, username]);
//   return <div>LiveStreamVideo</div>;
// };

// export default LiveStreamVideo;


