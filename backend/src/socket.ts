import {Server} from 'socket.io';


function socket(server: any) {

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })


    io.on('connection',(socket)=>{
        console.log(`USER CONNECTED WITH ID OF ${socket.id}`)
        
        socket.on('joinLivestream', (livestreamId, username)=>{
            socket.join(livestreamId);
            socket.to(livestreamId).emit('userJoined', username)
        })

        socket.on('disconnect', ()=>{
            console.log(`User disconnected with ID ${socket.id}`)
        })
    })

}

export default socket