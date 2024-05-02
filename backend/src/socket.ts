import { Server } from 'socket.io';
import { db } from './utils/db.server.js';

function socket(server: any) {
  const botName = 'Livestream bot';
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
    connectionStateRecovery: {},
  });

  io.on('connection', (socket) => {
    //listen for users that joins the room
    socket.on('joinRoom', (username, liveStreamRoomId) => {
      socket.join(liveStreamRoomId);

      //Welcome current user:
      socket.emit('message', {
        username: botName,
        message: `Welcome to the livestream @${username}`,
        timeStamp: new Date().toISOString(),
      });

      //Broadcast when user connects
      socket.broadcast.to(liveStreamRoomId).emit('message', {
        username: botName,
        message: `@${username} has joined the livestream`,
        timeStamp: new Date().toISOString(),
      });
    });

    socket.on(
      'chatMessage',
      async (username, message, liveStreamId, userId) => {
        //Find liveStream
        const newComment = await db.liveStreamComment.create({
          data: {
            content: message,
            userId: userId,
            liveStreamId: liveStreamId,
            username: username,
          },
        });

        io.to(liveStreamId).emit('message', {
          username: newComment.username,
          message: newComment.content,
          timeStamp: new Date().toISOString(), // or use the appropriate timestamp
        });
      }
    );

    type likeType = {
      postAuthorId: number;
      postId: number;
      likerFirstName: string;
      likerLastName: string;
      type: string;
    };
    //Notification with like
    socket.on('like', async (data: likeType) => {
      let content = '';

      if (data.type === 'likeShared') {
        content = `${data.likerFirstName} ${data.likerLastName} liked your shared post`;
      } else {
        content = `${data.likerFirstName} ${data.likerLastName} liked your post`;
      }
      const notification = await db.notification.create({
        data: {
          type: data.type,
          userId: data.postAuthorId,
          content: content,
          postId: data.postId,
        },
      });
      io.emit('newNotifs', notification)
    });


    socket.on('fetchNotifications', async (data: any) => {
      
      // Fetch notifications based on the user ID
      const userId = data.userId;
      const notifications = await db.notification.findMany({
        where: {
          userId: userId
        },
        orderBy:{
          createdAt: 'desc'
        }
      });
    
      // Emit the fetched notifications to all clients
      socket.emit('initialNotifications', notifications);
    });

    //Runs when client disconnects:

    socket.on('disconnect', () => {
      console.log('user leaves');
      //   io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });
  });
}

export default socket;
