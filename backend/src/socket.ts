import {Server} from 'socket.io';


function socket(server: any) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
        },
        connectionStateRecovery :{}
    })


    io.on('connection',(socket:any)=>{
        console.log(`USER CONNECTED WITH ID OF ${socket.id}`)
        
        //Informing who joins the livestream
        socket.on('joinLivestream', (livestreamId :string, username: string)=>{
            //Joins to a specific room
            socket.join(livestreamId);
            socket.to(livestreamId).emit('userJoined', username)
        })

        socket.on('comment', (message:string, username:string, liveStreamId:string)=>{
            //Save the comment to the database


            // Broadcast the comment to all users in the same livestream
            io.in(liveStreamId).emit('newComment', {message, username})
        })

        socket.on('disconnect', ()=>{
            console.log(`User disconnected with ID ${socket.id}`)
        })


    })

}

export default socket