import { Server } from 'socket.io';
import { db } from './utils/db.server.js';
function socket(server) {
    const botName = 'Livestream bot';
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173'
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
        socket.on('chatMessage', async (username, message, liveStreamId, userId) => {
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
        });
        //Runs when client disconnects:
        socket.on('disconnect', () => {
            console.log('user leaves');
            //   io.emit('message', formatMessage(botName, 'A user has left the chat'));
        });
    });
}
export default socket;
//# sourceMappingURL=socket.js.map